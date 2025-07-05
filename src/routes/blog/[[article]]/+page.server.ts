// import type { ServerLoad } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { PageServerLoad } from "./$types.js";
import { error } from "@sveltejs/kit";

type FrontMatterMetaData = {
  title: string;
  published?: boolean;
  order?: number;
};

type FrontMatterModule = { default: Component; metadata?: FrontMatterMetaData };

const articleFiles = import.meta.glob<FrontMatterModule>("../articles/*.mdx", {
  eager: true,
});

const articlesBySlug: Map<string, FrontMatterModule> = new Map(
  Object.entries(articleFiles).map(([path, mod]) => {
    const slug = path.replace("../articles/", "").replace(".mdx", "").toLowerCase();
    console.log("Creating blog post for:", slug);
    return [slug, mod];
  }),
);

const articles = Array.from(articlesBySlug.entries())
  .map(([key, mod]) => {
    return {
      slug: key,
      published: mod.metadata?.published ?? false,
      title: mod.metadata?.title ?? `"${key}" is missing an h1`,
      order: mod.metadata?.order ?? -1,
    };
  })
  .sort((a, b) => a.order - b.order);

export const load: PageServerLoad = ({ params }) => {
  if (params.article === undefined) {
    return { slug: undefined, articles };
  }

  const articleSlug = `${params.article}`.toLowerCase();

  if (!articlesBySlug.has(articleSlug)) {
    error(404, "Article was not found.");
  }

  return {
    articles,
    slug: articleSlug,
  };
};
