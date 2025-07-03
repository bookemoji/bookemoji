#!/usr/bin/env node

import degit from "degit";
import { intro, outro, text, isCancel, spinner, log } from "@clack/prompts";
import * as fs from "node:fs/promises";
import {
  CodeBlockWriter,
  ExportAssignment,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  printNode,
  Project,
  PropertyAssignment,
  ScriptTarget,
  SyntaxKind,
  VariableDeclaration,
} from "ts-morph";
import { exec } from "node:child_process";
import pc from "picocolors";

type PackageJson = Partial<{
  name: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}>;

const DEFAULT_ROUTE = "(design)";
main();

async function main() {
  intro(`create-bookemoji`);

  log.step("Checking SvelteKit project");
  if (await isSvelteKitProject()) {
    log.success("sveltekit detected");
  } else {
    log.error("Required files are missing.");
    log.info("Are you within a sveltekit project?");
    return;
  }

  const cli = process.argv.includes("--cli");
  let bookEmojiBaseRoute: string | symbol = DEFAULT_ROUTE;

  if (!cli) {
    bookEmojiBaseRoute = await text({
      message: "Where should bookemoji be configured?",
      placeholder: "src/routes/(design)",
      initialValue: DEFAULT_ROUTE,
      validate(value: string) {
        if (value.length === 0) return `Value is required!`;
      },
    });
  }

  if (isCancel(bookEmojiBaseRoute)) {
    log.error("You quit");
    return;
  }
  await applyVitePlugin();
  await installBookEmoji();
  await scaffoldRoutes(bookEmojiBaseRoute);
  await applyConfig(bookEmojiBaseRoute);

  outro(`📚 Books are stacked. You're ready to go!`);
}

async function fileExists(filepath: string) {
  try {
    return (await fs.stat(filepath)).isFile();
  } catch (err: any) {
    return false;
  }
}

async function isSvelteKitProject() {
  const skconfig = await fileExists("./svelte.config.js");
  const packageJsonFile = await fileExists("./package.json");
  const viteConfig = (await fileExists("./vite.config.ts")) || (await fileExists("./vite.config.js"));

  if (skconfig && packageJsonFile && viteConfig) {
    return true;
  }

  if (!skconfig) {
    log.error("svelte.config.js was not found");
  }

  if (!packageJsonFile) {
    log.error("package.json was not found");
  }

  if (!viteConfig) {
    log.error(`vite.config.ts / vite.config.js not found`);
  }

  return false;
}

async function installBookEmoji() {
  const s = spinner({ indicator: "dots" });
  s.start("Installing bookemoji");
  const installed = await new Promise((resolve) => {
    exec(`npm install bookemoji@latest`, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error installing bookemoji: ${error.message}`);
        resolve(false);
        return;
      }

      if (stderr) {
        log.warn(`npm stderr: ${stderr}`);
        resolve(false);
        return;
      }

      log.message(stdout);
      resolve(true);
    });
  });

  let version: string = "latest";
  if (installed) {
    try {
      const pkg: PackageJson = JSON.parse((await fs.readFile("./package.json")).toString());
      version = pkg.dependencies?.["bookemoji"] ?? pkg.devDependencies?.["bookemoji"] ?? "latest";
      if (version.startsWith("^")) {
        version = version.replace("^", "");
      }
    } catch (ex) {
      // do nada
    }
  }

  s.stop(`Installed bookemoji v${version}`);
}

async function scaffoldRoutes(bookEmojiBaseRoute: string) {
  const s = spinner();
  s.start("Creating Routes...");
  console.log();
  const TEMPLATE_REPO: string = "bookemoji/template";
  const DEFAULT_ROUTE = "(design)";
  let template = "base";

  const emitter = degit(`${TEMPLATE_REPO}/${template}`, {
    cache: false,
    force: true,
    verbose: false,
  });

  emitter.on("info", (info) => {
    // we intentionally are forcing
    if (info.message.startsWith("destination directory is not empty.")) {
      return;
    }

    log.success(info.message);
  });

  await emitter.clone("./src/routes/");
  s.stop("Routes Created");

  if (bookEmojiBaseRoute !== DEFAULT_ROUTE) {
    log.step("Updating downloaded route");
    const srcPath = `./src/routes/${DEFAULT_ROUTE}`;
    const destPath = `./src/routes/${bookEmojiBaseRoute}`;

    await fs.cp(srcPath, destPath, { recursive: true });
    await fs.rm(srcPath, { recursive: true, force: true });
    log.success(`Route renamed from ${DEFAULT_ROUTE} to ${bookEmojiBaseRoute}`);
  }
}

async function applyVitePlugin() {
  log.step("Adding to Vite Config");
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.Latest,
      allowJs: true,
    },
  });

  const sourceFile = project.addSourceFileAtPathIfExists("./vite.config.js") ?? project.addSourceFileAtPathIfExists("./vite.config.ts");

  let changed: boolean = false;
  if (sourceFile) {
    try {
      const importDecs = sourceFile?.getImportDeclarations();

      let found: boolean = false;
      for (const importDec of importDecs) {
        const specifier = importDec.getModuleSpecifier();
        const text = specifier.getText().replaceAll(`"`, "").replaceAll(`'`, "");

        if (text === "bookemoji/vite" || text === "vite-plugin-bookemoji") {
          found = true;
          break;
        }
      }

      if (found) {
        log.info("Import for bookemoji already present. ");
      } else {
        changed = true;
        // add `import { bookemoji } from "bookemoji/vite";
        sourceFile.addImportDeclaration({
          namedImports: ["bookemoji"],
          moduleSpecifier: "bookemoji/vite",
        });
      }

      const defineConfig = sourceFile.getExportAssignment((exportAssignment) => exportAssignment.getText().startsWith(`export default defineConfig`));

      if (defineConfig) {
        // defineConfig( )
        const callExpression = defineConfig.getExpressionIfKind(SyntaxKind.CallExpression);
        if (callExpression) {
          const obj = callExpression.getArguments().at(0)?.asKind(SyntaxKind.ObjectLiteralExpression);

          if (obj) {
            const plugins = obj.getProperty("plugins");

            if (plugins !== undefined) {
              const pluginList = plugins.getChildAtIndex(2);
              const p = pluginList.asKind(SyntaxKind.ArrayLiteralExpression);

              if (p) {
                p.addElement("bookemoji()");
                changed = true;
              } else {
                log.warn(`value of "plugins" section isn't modifyable or doesn't exist.`);
                log.step(`Please add ${pc.green("bookemoji()")} to your "plugins" field:\n` + `plugins: [sveltekit(), bookemoji()]`);
              }
            } else {
              log.warn("");
            }
          }
        }
      } else {
        log.warn("export default defineConfig not found in vite.config.");
      }

      if (changed) {
        log.success("Modified vite config");
        await sourceFile.save();
      } else {
        log.error("Unable to modify vite config");
      }
    } catch (ex) {
      log.error("Something went wrong: " + (<Error>ex).message);
    }
  }
}

async function applyConfig(bookEmojiBaseRoute: string) {
  log.step("Adding bookemoji configuration to sveltekit config");
  let modified: boolean = false;

  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.Latest,
      allowJs: true,
    },
  });

  const sourceFile = project.addSourceFileAtPath("./svelte.config.js");

  try {
    let configDeclaration: VariableDeclaration | undefined = undefined;
    for (const statement of sourceFile.getVariableStatements()) {
      for (const decs of statement.getDeclarations()) {
        // const config = {}
        if (decs.getName() === "config" && decs.getInitializer() !== undefined) {
          configDeclaration = decs;
        }
      }
    }

    if (configDeclaration) {
      const initializer = configDeclaration.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
      for (const assignment of initializer.getChildrenOfKind(SyntaxKind.PropertyAssignment)) {
        if (assignment.getName() === "kit") {
          const kitInit = assignment.getInitializer() as ObjectLiteralExpression;

          const bookemojiProperty: ObjectLiteralElementLike | undefined = kitInit.getProperty("bookemoji");

          if (!bookemojiProperty) {
            kitInit.addPropertyAssignment({
              name: "bookemoji",
              initializer: (writer: CodeBlockWriter) => {
                writer.write("{");
                writer.writeLine(`base: "/books",`);
                writer.writeLine(`stories: "src/routes/${bookEmojiBaseRoute}/books/stories"`);
                writer.writeLine("}");
              },
            });

            modified = true;
          } else {
            // "bookemoji" field already exists, we do nada
            log.success("config already present");
          }
        }
      }
    } else {
      log.warn("The format of your svelte.config.js wasn't implemented by this tool.");
    }

    if (modified) {
      await sourceFile.save();
    }
  } catch (ex) {
    log.error("Failed to save alias changes");
    return;
  }

  if (modified) {
    log.success("Modified svelte.config.js");
    return true;
  } else {
    return false;
  }
}
