// we cant use an external import or this will be considered an "external module"
// import type { Component } from "svelte";

type BookEmojiConfig = {
  /**
   * This is the base url of the bookemoji experience
   */
  base: `/${string}`;
  stories: string;
};

/**
 */
declare module "virtual:bookemoji" {
  type ComponentModule = {
    default: Component;
    metadata: ComponentMetaData;
  };
  export const base: BookEmojiConfig["base"];

  export const stories: Record<string, Promise<ComponentModule>>;

  export const loadStories: () => Promise<Record<string, ComponentModule>>;
}
