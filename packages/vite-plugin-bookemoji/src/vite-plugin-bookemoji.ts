import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import pc from "picocolors";

import * as path from "node:path";
import { default as fg } from "fast-glob"; // Fast and efficient globbing library
import * as fs from "node:fs/promises"; // For checking file existence asynchronously
import type { BookEmojiConfig } from "./config.js";

const bec = pc.magenta;
const plugin_prefix: string = bec("  📘 bookemoji  ");
const virtualModuleId: string = "virtual:bookemoji" as const;
const resolvedVirtualModuleId: string = "\0" + virtualModuleId;

export type BookEmojiPluginOptions = {
  debug?: boolean;
  silent?: boolean;
};

/**
 * A Vite plugin that allows importing configuration from a specific file
 * and uses that configuration to define a glob pattern for finding files
 * relative to the user's project root.
 */
export default function bookEmojiPlugin(options?: BookEmojiPluginOptions): Plugin {
  type LogLevel = "info" | "error" | "warn" | "debug";

  const log = (logLevel: LogLevel, ...args: unknown[]) => {
    if (logLevel === "error") {
      console.error(plugin_prefix, ...args);
    } else if (logLevel === "info") {
      console.log(plugin_prefix, ...args);
    } else if (logLevel === "warn") {
      console.warn(plugin_prefix, ...args);
    } else if (logLevel === "debug" && options?.debug === true) {
      console.log(plugin_prefix, "[debug]", ...args);
    }
  };

  const error = (...args: unknown[]) => {
    log("error", ...args);
  };

  let config: ResolvedConfig; // Stores Vite's resolved configuration
  // Default glob pattern. This will be used if no custom config file is found
  // or if the globPattern is not defined in the custom config.
  let bookEmojiConfig: BookEmojiConfig | undefined = undefined;
  let userGlobPattern: string = "./books/stories/**/*.book.svelte";
  let projectRoot: string; // Absolute path to the user's project root directory

  return {
    // A unique name for your plugin. This helps with debugging.
    name: "vite-plugin-bookemoji",

    configureServer(server: ViteDevServer) {
      const _print = server.printUrls;

      server.printUrls = () => {
        _print();
        if (!(options?.silent ?? false)) {
          const url = server.resolvedUrls?.local[0];
          if (url && bookEmojiConfig?.base && bookEmojiConfig?.base !== "/") {
            const bookEmojiUrl = new URL(url);
            bookEmojiUrl.pathname = bookEmojiConfig?.base;
            config.logger.info(`  ${pc.green("➜")}  ${pc.bold("bookemoji")}: ${bec(bookEmojiUrl.origin.toString())}${bec(pc.bold(bookEmojiUrl.pathname))}`);
          }
        }
      };
    },

    /**
     * Hook called after Vite's configuration is resolved.
     * This is where we get access to the final configuration, including the project root.
     * We also attempt to load the user's custom configuration file here.
     * @param {ResolvedConfig} resolvedConfig - The resolved Vite configuration.
     */
    async configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
      projectRoot = config.root; // Vite's `root` is the absolute path to the project root

      // Define the name and path for the optional user configuration file.
      log("debug", "projectRoot", projectRoot);

      const configFilePath: string = `${projectRoot}/svelte.config.js`;

      try {
        // Check if the custom configuration file exists.
        // `fs.access` throws an error if the file does not exist.
        log("debug", "Attempting import of configFilePath:", configFilePath);

        await fs.access(configFilePath);

        // Dynamically import the user's config file.
        // We assume it's an ESM module exporting a default object.
        log("debug", "Importing configFilePath:", configFilePath);
        const svelteConfig = await import(`file://${path.normalize(configFilePath)}`);

        // Check if the module has a default export and if it contains a 'globPattern' string.
        if (svelteConfig && svelteConfig.default) {
          bookEmojiConfig = svelteConfig.default?.bookemoji;
          userGlobPattern = bookEmojiConfig?.stories ?? "";

          const action = `${resolvedConfig.command === "build" ? "building stories from" : "watching"} ${pc.dim(userGlobPattern)}`;
          log("info", `${pc.green(pc.bold("config found"))} — ${pc.dim(action)}`);
        }

        if (!bookEmojiConfig) {
          // Warn if the file exists but doesn't have the expected structure.
          log("warn", `bookemoji not found in svelte.config.js`);
        } else if (userGlobPattern === "") {
          log("warn", `svelte.config.js's "bookemoji" does not contain a valid "stories" value`);
        }
      } catch (e) {
        // If the file doesn't exist (ENOENT error code), log that we're using the default.
        // For other errors during import, log the error and fall back to default.
        if ((e as { code: string }).code === "ENOENT") {
          log("error", `svelte.config.js not found.`);
        } else {
          log("warn", "An unknown error when trying to load config:", e);
        }
      }
    },

    /**
     * Hook called when Vite tries to resolve an import specifier.
     * We use this to intercept our virtual module import.
     * @param {string} source - The import specifier.
     * @returns {string | null} The resolved ID for the virtual module, or null.
     */
    resolveId(source: string /*importer: string, attributes: object*/): string | null {
      // If the source is our virtual module identifier, return it directly.
      // This tells Vite that this is a module our plugin will handle.
      if (source === virtualModuleId) {
        return resolvedVirtualModuleId;
      }

      return null; // Let other plugins or Vite handle other import specifiers.
    },

    /**
     * Hook called when Vite tries to load the content of a resolved ID.
     * This is where we provide the actual content for our virtual module.
     * @param {string} id - The resolved ID of the module to load.
     * @returns {Promise<string | null>} The JavaScript content for the module, or null.
     */
    async load(id: string): Promise<string | null> {
      // If the ID matches our virtual module, generate its content.
      if (id === resolvedVirtualModuleId) {
        // Ensure projectRoot is set before proceeding.
        // This check is a safeguard, as configResolved should have run already.
        if (!projectRoot) {
          error('projectRoot not set. "configResolved" might not have run yet. Returning empty array.');
          return createExportStatements(bookEmojiConfig?.base ?? "", []);
        }

        try {
          // Use fast-glob to find files matching the pattern.
          // `cwd`: Specifies the current working directory for globbing. Crucial for relative paths.
          // `absolute: false`: Ensures the returned file paths are relative to `cwd`.
          // `ignore`: Exclude common directories to speed up globbing and avoid irrelevant files.
          log("debug", "full search path:", path.posix.normalize(userGlobPattern));

          if (userGlobPattern.includes("(") || userGlobPattern.includes(")")) {
            log("debug", pc.dim(`escaping parenthesis in "${userGlobPattern}" for globbing`));
          }

          const glob = path.posix.normalize(userGlobPattern).replaceAll("(", "\\(").replaceAll(")", "\\)");

          log("debug", `Searching for files with pattern "${glob}" relative to "${projectRoot}"`);
          log("debug", "Original:", userGlobPattern);

          const files = await fg(glob, {
            objectMode: true,
            cwd: path.posix.normalize(projectRoot),
            absolute: false,
            globstar: true,
            onlyFiles: true,
            ignore: ["node_modules/**", "dist/**", ".git/**", ".vscode/**"],
          });

          if (config.command === "build") {
            log("info", "");
          }
          log("info", `Found ${files.length} ${files.length === 1 ? "story" : "stories"}`);

          files.forEach((f) => log("debug", "- ", f.name));

          // Generate an array of dynamic import expressions.
          // Each `import()` call will be resolved by Vite's normal module resolution.
          // The `/* @vite-ignore */` comment is a Vite magic comment that tells Vite
          // to not warn about dynamic import paths that cannot be statically analyzed.
          // This is useful here because the paths are generated dynamically.
          // const importStatements = normalizedFiles.map((file) => `import(/* @vite-ignore */ '/${file}')`);

          // Return the content as a JavaScript module string.
          // This module exports an array named `modules` containing the promises
          // returned by the dynamic import calls.
          return createExportStatements(
            bookEmojiConfig?.base ?? "",
            files.map((f) => `./${f.path}`),
          );
          // `export const base = ""; export const stories = {
          // ${importStatements.join(",\n")},
          // ;`;
        } catch (error) {
          console.error(plugin_prefix, `Error globbing files:`, error);
          return createExportStatements(bookEmojiConfig?.base ?? "", []);
        }
      }
      // Let other plugins or Vite handle other IDs.
      return null;
    },
  };
}

function createExportStatements(base: string, files: string[]) {
  // Normalize file paths to use forward slashes, which is standard for web paths
  // and ensures consistency across different operating systems (Windows vs. Unix-like).
  // const normalizedFiles = files.map((file) => file);
  // const entries: string[] = [];
  const entries: string[] = files.map((file) => `"${file}": import(/* @vite-ignore */ '${file}'), `);

  const _base: string = `export const base = "${base}";`;
  const _stories: string = `export const stories = {
  ${entries.join("\n")}
  };`;
  const _loadStories = `export const loadStories = async () => {
    
    // this map lets our imports be statically analyzed
    const map = {
      ${files.map((a) => `"${a}": import("${a}")`).join(",\n")}
    };

    const record = {
      ${files.map((a) => `"${a}": null`).join(",\n")}
    };

    const loadPromises = Array.from(Object.entries(map)).map(([key, loader]) => {
      return loader.then((mod) => {
        record[key] = mod.default ?? mod;
      });
    });
    
    await Promise.allSettled(loadPromises);

    return record;
  };`;

  return `
  ${_base}
  ${_stories}
  ${_loadStories}
  `;
}
