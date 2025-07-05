import type { Component } from "svelte";
import type { PageLoad } from "./$types.js";
import { building, dev } from "$app/environment";

export const load: PageLoad = async ({ data, ...event }) => {
  let showAll: boolean = false;
  if (dev && !building) {
    showAll = event.url.searchParams.has("unpublished");
  }
  return {
    ...data,
    showAll,
    Content: data.slug ? ((await import(`../articles/${data.slug}.mdx`)) as { default: Component }) : null,
  };
};
