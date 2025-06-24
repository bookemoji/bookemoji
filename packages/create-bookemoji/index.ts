import degit from "degit";
import { intro, outro, text } from "@clack/prompts";

async function main() {
  intro(`create-bookemoji`);
  // https://github.com/bookemoji/template
  // https://github.com/bookemoji/bookemoji
  const TEMPLATE_REPO: string = "https://github.com/bookemoji/template";

  const meaning = await text({
    message: "What is the meaning of life?",
    placeholder: "Not sure",
    initialValue: "42",
    validate(value: string) {
      if (value.length === 0) return `Value is required!`;
    },
  });
  const emitter = degit(TEMPLATE_REPO, {
    cache: true,
    force: true,
    verbose: true,
  });

  emitter.on("info", (info) => {
    console.log(info.message);
  });

  emitter.clone("path/to/dest").then(() => {
    console.log("done");
  });

  outro(`You're all set!`);
}

main();
