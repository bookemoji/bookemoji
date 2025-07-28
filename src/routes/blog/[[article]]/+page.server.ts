// import type { ServerLoad } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { PageServerLoad } from "./$types.js";
import { error } from "@sveltejs/kit";
import { articles, articlesBySlug } from "$lib/server/articles.js";

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
