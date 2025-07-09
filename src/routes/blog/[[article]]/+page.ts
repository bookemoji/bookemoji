import type { Component } from "svelte";
import type { PageLoad } from "./$types.js";
import { building, dev } from "$app/environment";
import type { FrontMatterMetaData } from "./+page.server.js";

type RenderableArticle = {
  Content: Component;
  metadata: Required<FrontMatterMetaData>;
};

export const load: PageLoad = async ({ data, ...event }) => {
  let showAll: boolean = false;
  if (dev && !building) {
    showAll = event.url.searchParams.has("unpublished");
  }

  let page: RenderableArticle | undefined = undefined;

  if (data.slug) {
    const mod = (await import(`../articles/${data.slug}.mdx`)) as { default: Component; metadata: FrontMatterMetaData };

    page = {
      Content: mod.default,
      metadata: {
        title: mod.metadata.title,
        date: mod.metadata.date ?? "1/1/1975",
        published: mod.metadata.published ?? false,
        author: mod.metadata.author ?? "bookemoji team",
      },
    };
  }

  return {
    ...data,
    showAll,
    page,
  };
};
