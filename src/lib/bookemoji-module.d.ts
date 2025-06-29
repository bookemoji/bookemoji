// we cant use an external import or this will be considered an "external module"
// import type { Component } from "svelte";

type BookEmojiConfig = {
  base: string;
  stories: string;
};

/**
 */
declare module "virtual:bookemoji" {
  export const base: BookEmojiConfig["base"];

  export const stories: Record<string, Promise<{ default: unknown }>>;

  export const loadStories: () => Promise<Record<string, Component>>;
}
