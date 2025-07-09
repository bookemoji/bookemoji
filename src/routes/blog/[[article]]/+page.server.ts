// import type { ServerLoad } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { PageServerLoad } from "./$types.js";
import { error } from "@sveltejs/kit";

export type FrontMatterMetaData = {
  title: string;
  published?: boolean;
  author?: string;
  date?: string;
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
      date: mod.metadata?.date ?? "1/1/1975",
      author: mod.metadata?.author ?? "bookemoji team",
    };
  })
  .sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);

    if (aDate.toString() === "Invalid Date") {
      return 1;
    }

    if (bDate.toString() === "Invalid Date") {
      return -1;
    }

    return aDate.valueOf() - bDate.valueOf();
  });

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
