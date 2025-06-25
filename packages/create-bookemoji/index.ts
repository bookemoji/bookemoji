import degit from "degit";
import { intro, outro, text, isCancel, spinner, log } from "@clack/prompts";
import * as fs from "node:fs/promises";

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
  log.step("Configuring your sveltekit config");
}
