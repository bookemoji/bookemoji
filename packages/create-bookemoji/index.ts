import degit from "degit";
import { intro, outro, text, isCancel, spinner, log } from "@clack/prompts";
import * as fs from "node:fs/promises";
import {
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

  await scaffoldRoutes(bookEmojiBaseRoute);
  await applyAliases(bookEmojiBaseRoute);

  outro(`You're all set!`);
}

async function isSvelteKitProject() {
  try {
    const stat = await fs.stat("./svelte.config.js");
    return stat.isFile();
  } catch (err: any) {
    return false;
  }
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
  let success: boolean = false;

  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.addSourceFileAtPath("./svelte.config.js");
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
        const kitProperties = kitInit.getProperties();
        let aliasProp: ObjectLiteralElementLike = kitInit.getProperty("alias");

        if (aliasProp && aliasProp instanceof PropertyAssignment) {
          const initializer = aliasProp.getInitializer() as ObjectLiteralExpression;
          //   const props = initializer.getProperties();
          if (initializer.getFullText().includes(`"$bookemoji.config"`) && initializer.getFullText().includes(`"$bookemoji.stories"`)) {
            // already here, nothing to do
            log.info("Aliases already present — nothing to do");
          } else {
            initializer.addPropertyAssignments([
              {
                name: "$bookemoji.config",
                initializer: `src/routes/${bookEmojiBaseRoute})/books/bookemoji.config.ts`,
              },
              {
                name: "$bookemoji.stories",
                initializer: `src/routes/${bookEmojiBaseRoute})/books/stories`,
              },
            ]);
            success = true;
          }
        } else {
        }
      }
    }
  } else {
    // find it as "export default { }" ?
  }

  await sourceFile.save();
  if (success) {
    log.step("Inserted aliases and saved file");
  } else {
    log.info("What happened?");
  }

  console.log();
}
