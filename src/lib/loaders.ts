import type * as Kit from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";
import { findStoryFiles, type BookEndpointResponse } from "./book-emoji.js";
import "./bookemoji-module.d.ts";
import { stories, base } from "virtual:bookemoji";

import type {
  StoryLayoutParams,
  StoryLayoutParentData,
  StoryLayoutOutputData,
  VariantLayoutParentData,
  VariantLayoutParams,
  VariantLayoutOutputData,
} from "./sveltekit-runtime-types.js";
import type { Component } from "svelte";

/**
 * Loads books via API endpoint
 * For use as /{base}/+layout.server.ts
 * @returns
 */
export const layoutServerLoad: Kit.ServerLoad<never, never, BookEndpointResponse> = async ({ fetch }) => {
  const bookRes = await fetch("/books.json");
  const endpointResponse: BookEndpointResponse = await bookRes.json();

  // Sort books by name
  //   bookList.sort((a, b) => a.name.localeCompare(b.name));

  return endpointResponse;
};

export const createServerGET = <T extends Kit.RequestHandler = Kit.RequestHandler>(): T => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const GET: Kit.RequestHandler = async (event) => {
    // const bookEmojiModule = await import("virtual:bookemoji");
    // const config: BookEmojiConfig = bookEmojiModule.config;
    const books = await findStoryFiles();

    return json({
      base,
      books,
    });
  };

  return GET as T;
};

export const storyLayoutLoad: Kit.Load<Partial<StoryLayoutParams>, null, StoryLayoutParentData, StoryLayoutOutputData, string> = async (event) => {
  const { params, parent } = event;
  const { story } = params;

  // these could maybe be userland
  if (!story) {
    error(404, `Book ${story} not found`);
  }

  const parentData: StoryLayoutParentData = await parent();

  const { books } = parentData;

  const book = books.find((b: { name: string }) => b.name.toLowerCase() === story.toLowerCase());

  // these could maybe be userland
  if (!book) {
    error(404, `Book ${story} not found in booklist`);
  }

  // const bookEmoji = await import("virtual:bookemoji");

  // const bookComponent = await import(/* @vite-ignore */ `${base}/${book.name}.book.svelte`);
  // const bookComponent = await import(book.path);
  const [, loadComponent] = Object.entries(stories).find(([localPath]) => {
    return localPath === book.path;
  }) ?? [book.name, undefined];

  if (loadComponent === undefined) {
    error(404, `Book ${story} not found when preloading.`);
  }

  const bookComponent: Component | undefined = await loadComponent.then((mod) => <Component | undefined>mod.default);

  if (bookComponent === undefined) {
    error(404, `Book ${story} could not be loaded.`);
  }

  return {
    Book: bookComponent,
    name: book.name,
  };
};

export const variantLayoutLoad: Kit.Load<Partial<VariantLayoutParams>, null, VariantLayoutParentData, VariantLayoutOutputData, string> = async (event) => {
  const { params, parent } = event;
  const parentData = await parent();

  const { Book, name, books } = parentData;
  if (params.variant === "") {
    // redirect to the story?
    error(404, `Variant for Story ${name} not found.`);
  }

  const bookDef = books.find((b) => b.name === name);
  if (!bookDef) {
    error(404, "Book definition not found");
  }

  const { variants } = bookDef;

  const variant = Object.values(variants).find((v) => v.slug === params.variant);

  if (!variant) {
    error(404, `Story Variant "${params.variant}" for ${name} was not found`);
  }

  return { Book, name, variant };
};
