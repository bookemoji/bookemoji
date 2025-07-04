import type { Component } from "svelte";
import type { PageLoad } from "./$types.js";

export const load: PageLoad = async ({ data }) => {
  return {
    ...data,
    Content: data.slug ? ((await import(`../articles/${data.slug}.mdx`)) as { default: Component }) : null,
  };
};
