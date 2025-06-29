import type { Plugin, ResolvedConfig } from "vite";

import * as path from "node:path";
import { default as fg } from "fast-glob"; // Fast and efficient globbing library
import * as fs from "node:fs/promises"; // For checking file existence asynchronously
import type { BookEmojiConfig } from "./config.js";

const plugin_prefix: string = "[bookemoji]";
const virtualModuleId: string = "virtual:bookemoji" as const;
const resolvedVirtualModuleId: string = `\0${virtualModuleId}`;

/**
 * A Vite plugin that allows importing configuration from a specific file
 * and uses that configuration to define a glob pattern for finding files
 * relative to the user's project root.
 */
export default function bookEmojiPlugin(): Plugin {
  const log = (...args: unknown[]) => {
    console.log(plugin_prefix, ...args);
  };

  const error = (...args: unknown[]) => {
    console.error(plugin_prefix, ...args);
  };

  let config; // Stores Vite's resolved configuration
  // Default glob pattern. This will be used if no custom config file is found
  // or if the globPattern is not defined in the custom config.
  let bookEmojiConfig: BookEmojiConfig | undefined = undefined;
  let userGlobPattern: string = "./books/stories/**/*.book.svelte";
  let projectRoot: string; // Absolute path to the user's project root directory
  let isActive: boolean = false;

  return {
    // A unique name for your plugin. This helps with debugging.
    name: "vite-plugin-bookemoji",

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
      log("projectRoot", projectRoot);

      const configFilePath: string = `${projectRoot}/svelte.config.js`;

      try {
        // Check if the custom configuration file exists.
        // `fs.access` throws an error if the file does not exist.
        log("Attempting import of configFilePath:", configFilePath);

        await fs.access(configFilePath);

        // Dynamically import the user's config file.
        // We assume it's an ESM module exporting a default object.
        log("Importing configFilePath:", configFilePath);
        const svelteConfig = await import(configFilePath);

        // Check if the module has a default export and if it contains a 'globPattern' string.
        if (svelteConfig && svelteConfig.default) {
          bookEmojiConfig = svelteConfig.default?.bookemoji;
          userGlobPattern = bookEmojiConfig?.stories ?? "";
          log(`Using custom glob pattern from svelte.config.js: "${userGlobPattern}"`);
        }

        if (!bookEmojiConfig) {
          // Warn if the file exists but doesn't have the expected structure.
          console.warn(plugin_prefix, `bookemoji not found in svelte.config.js`);
        } else if (userGlobPattern === "") {
          console.warn(plugin_prefix, `svelte.config.js's "bookemoji" does not contain a valid "stories" value`);
        } else {
          isActive = true;
        }
      } catch (e) {
        // If the file doesn't exist (ENOENT error code), log that we're using the default.
        // For other errors during import, log the error and fall back to default.
        if ((e as { code: string }).code === "ENOENT") {
          log(`svelte.config.js not found.`);
        }
      }
    },

    /**
     * Hook called when Vite tries to resolve an import specifier.
     * We use this to intercept our virtual module import.
     * @param {string} source - The import specifier.
     * @returns {string | null} The resolved ID for the virtual module, or null.
     */
    resolveId(source: string): string | null {
      // If the source is our virtual module identifier, return it directly.
      // This tells Vite that this is a module our plugin will handle.
      if (source === virtualModuleId) {
        console.log("resolvedVirtualModuleId", source, resolvedVirtualModuleId);
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
    async load(id: string, options): Promise<string | null> {
      // If the ID matches our virtual module, generate its content.
      if (id === resolvedVirtualModuleId && isActive) {
        if (options?.ssr) {
          log("SSR'ing");
        }

        // Ensure projectRoot is set before proceeding.
        // This check is a safeguard, as configResolved should have run already.
        if (!projectRoot) {
          error('projectRoot not set. "configResolved" might not have run yet. Returning empty array.');
          return createExportStatements(bookEmojiConfig?.base ?? "", []);
        }

        log(`Searching for files with pattern "${userGlobPattern}" relative to "${projectRoot}"`);

        try {
          // Use fast-glob to find files matching the pattern.
          // `cwd`: Specifies the current working directory for globbing. Crucial for relative paths.
          // `absolute: false`: Ensures the returned file paths are relative to `cwd`.
          // `ignore`: Exclude common directories to speed up globbing and avoid irrelevant files.
          log("full search path:", path.join(projectRoot, userGlobPattern));
          const files = await fg(userGlobPattern, {
            cwd: projectRoot,
            absolute: false,
            ignore: ["node_modules/**", "dist/**", ".git/**", ".vscode/**"],
          });

          log(`${files.length} files found:`);
          files.forEach((f) => log("\t- ", f));

          // console.log(plugin_prefix, `Found ${normalizedFiles.length} files: ${JSON.stringify(normalizedFiles)}`);

          // Generate an array of dynamic import expressions.
          // Each `import()` call will be resolved by Vite's normal module resolution.
          // The `/* @vite-ignore */` comment is a Vite magic comment that tells Vite
          // to not warn about dynamic import paths that cannot be statically analyzed.
          // This is useful here because the paths are generated dynamically.
          // const importStatements = normalizedFiles.map((file) => `import(/* @vite-ignore */ '/${file}')`);

          // Return the content as a JavaScript module string.
          // This module exports an array named `modules` containing the promises
          // returned by the dynamic import calls.
          return createExportStatements(bookEmojiConfig?.base ?? "", files);
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
  const normalizedFiles = files.map((file) => file.replace(/\\/g, "/"));
  const entries: string[] = normalizedFiles.map((file) => `"${file}": import(/* @vite-ignore */ '/${file}'), `);

  const _base: string = `export const base = "${base}";`;
  const _stories: string = `export const stories = {
  ${entries.join("\n")}
  };`;
  const _loadStories = `export const loadStories = async () => {
    const record = {};
    const files = [${normalizedFiles.join(",")}]
    const loadPromises = files.map((file) => {
      return import(/* @vite-ignore */ file)
        .then( mod => {
          record[file] = mod.default;
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
