import type { Component } from "svelte";
import type { PageLoad } from "./$types.js";

export const load: PageLoad = async ({ data, ...event }) => {
  const showAll = event.url.searchParams.has("unpublished");
  return {
    ...data,
    showAll,
    Content: data.slug ? ((await import(`../articles/${data.slug}.mdx`)) as { default: Component }) : null,
  };
};
