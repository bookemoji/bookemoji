import type { Component } from "svelte";
import type { BookDefinition, VariantDefinition } from "./book-emoji.js";

// These types need to be compatible with the generated types from sveltekit ($types.d.ts)
export type VariantRouteParams = {
  story: string;
  variant: string;
};

export type StoryRouteParams = {
  story: string;
};

export type VariantEntryGenerator = () => Promise<Array<VariantRouteParams>> | Array<VariantRouteParams>;
export type StoryEntryGenerator = () => Promise<Array<StoryRouteParams>> | Array<StoryRouteParams>;

export type StoryLayoutParams = StoryRouteParams;
export type StoryLayoutParentData = { books: BookDefinition[] };
export type StoryLayoutOutputData = {
  Book: Component;
  name: string;
};

export type VariantLayoutParentData = StoryLayoutParentData & StoryLayoutOutputData;
export type VariantLayoutParams = VariantRouteParams;
export type VariantLayoutOutputData = {
  Book: Component;
  name: string;
  variant: VariantDefinition;
};
