import type { Component } from "svelte";
import { render } from "svelte/server";
import { parse } from "node-html-parser";

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

    const component = docFiles[key];
    const content = render(component, {});
    const slug = key
      .replace("../../documentation/", "")
      .replace(".mdx", "")
      // remove ordering prefix (01-, 02-, etc)
      .substring(3);

    const doc = parse(content.body, {
      comment: false,
    });

    // remove comments
    content.body = doc.toString();

    const h1: string = doc.querySelector("h1")?.text ?? `${slug} needs a <h1>`;

    docs.set(slug, content.body);
    tableOfContents.set(slug, h1);
  }

  return { tableOfContents, docs };
};

export const tableOfContents = new Map<string, string>();
