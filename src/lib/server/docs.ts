import type { Component } from "svelte";
import { render } from "svelte/server";
import { compile as compileMDX } from "mdsvex";
import { compile } from "svelte/compiler";
import { read } from "$app/server";

export const docFiles = import.meta.glob<Component>("../../documentation/**/*.mdx", {
  eager: true,
  import: "default",
});

const docFileNames = Object.keys(docFiles);

export const docs = new Map<string, string>();

export const createDocs = async () => {
  for (let key of docFileNames) {
    if (docs.has(key)) {
      continue;
    }

    console.log("rendering", key);

    // const text = await read(key).text();
    const component = docFiles[key];
    const content = render(component, {});
    console.log("content?", content);
    const slug = key.replace("../../documentation/", "").replace(".mdx", "");
    docs.set(slug, content.body);
    // const svelteCode = await compileMDX(text, {});
    // if (svelteCode) {
    //     const svelteComponent = compile(svelteCode.code, {
    //         generate: "server"
    //     })
    //     const content = render(svelteComponent.js.code, {});
    //     docs.set(key, content);
    // }
  }
};
