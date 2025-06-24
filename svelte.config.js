import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

import { mdsvex, escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";

const theme = "catppuccin-frappe";
const highlighter = await createHighlighter({
  themes: [theme],
  langs: ["javascript", "typescript", "svelte"],
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extension: ".mdx",
  // layout: {
  //   default: "./src/routes/docs/layouts/DefaultLayout.svelte",
  // },
  highlight: {
    highlighter: async (code, lang = "text") => {
      const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
      return `{@html \`${html}\` }`;
    },
  },
};

/**
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter(),
    paths: {
      base: process.argv.includes("dev") ? "" : process.env.BASE_PATH,
    },
    alias: {
      "$bookemoji.config": "src/routes/(example)/books/config.ts",
      "$bookemoji.stories": "src/routes/(example)/books/stories",
    },
  },

  extensions: [".svelte", ".mdx"],
};

export default config;
