import degit from "degit";
import { intro, outro, text, isCancel, spinner, log } from "@clack/prompts";
import * as fs from "node:fs/promises";
import {
  CodeBlockWriter,
  Identifier,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  ScriptTarget,
  SyntaxKind,
  ts,
  VariableDeclaration,
} from "ts-morph";
import { exec } from "node:child_process";

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
    log.success("svelte.config.js found");
  } else {
    log.info("svelte.config.js not found");
    log.error("Current directory does not appear to be a sveltekit project.");
    return;
  }

  const bookEmojiBaseRoute = await text({
    message: "Where should bookemoji be configured?",
    placeholder: "src/routes/(design)",
    initialValue: DEFAULT_ROUTE,
    validate(value: string) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  if (isCancel(bookEmojiBaseRoute)) {
    log.error("You quit");
    return;
  }

  await installBookEmoji();
  await scaffoldRoutes(bookEmojiBaseRoute);
  await applyAliases(bookEmojiBaseRoute);

  outro(`📚 Books are stacked. You're ready to go!`);
}

async function isSvelteKitProject() {
  try {
    const stat = await fs.stat("./svelte.config.js");
    const pkg = await fs.stat("./package.json");
    return stat.isFile() && pkg.isFile();
  } catch (err: any) {
    return false;
  }
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

async function applyAliases(bookEmojiBaseRoute: string) {
  log.step("Adding bookemoji aliases to sveltekit config");
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

          let aliasProp: ObjectLiteralElementLike | undefined = kitInit.getProperty("alias");

          if (aliasProp) {
            // alias field already exists
            const initializer = (<PropertyAssignment>aliasProp).getInitializer() as ObjectLiteralExpression;
            //   const props = initializer.getProperties();
            if (initializer.getFullText().includes(`"$bookemoji.config"`) && initializer.getFullText().includes(`"$bookemoji.stories"`)) {
              // already here, nothing to do
              log.message("Aliases already present — nothing to do 🎉");
            } else {
              initializer.addPropertyAssignments([
                {
                  name: "$bookemoji.config",
                  initializer: `src/routes/${bookEmojiBaseRoute}/books/bookemoji.config.ts`,
                },
                {
                  name: "$bookemoji.stories",
                  initializer: `src/routes/${bookEmojiBaseRoute}/books/stories`,
                },
              ]);
              modified = true;
            }
          } else {
            // "alias" does not exist in the config
            kitInit.addPropertyAssignment({
              name: "alias",
              initializer: (writer: CodeBlockWriter) => {
                writer.write("{");
                writer.writeLine(`"$bookemoji.config": "src/routes/${bookEmojiBaseRoute}/books/bookemoji.config.ts",`);
                writer.writeLine(`"$bookemoji.stories": "src/routes/${bookEmojiBaseRoute}/books/stories"`);
                writer.writeLine("}");
              },
            });

            modified = true;
          }
        }
      }
    } else {
      // find it as "export default { }" ?
      // who would do this?!
      log.warn("The format of your svelte.config.js wasn't implemented.");
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
