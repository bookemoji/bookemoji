import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageLoad } from "./$types.js";
import type { Component } from "svelte";
import { findStoryFiles } from "$lib/book-emoji.js";

export const load: PageLoad = async ({ params, parent }) => {
  const { Book, name, bookList } = await parent();
  if (params.variant === "") {
    // redirect to the story?
    error(404, `Variant for Story ${name} not found.`);
  }

  const bookDef = bookList.find((b) => b.name === name);
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

export const entries: EntryGenerator = async () => {
  const books = import.meta.glob<{ default: Component }>("../stories/**/*.book.svelte", {
    eager: true,
  });

  const bookList = await findStoryFiles("/books", books);

  const prerenderStories = bookList.map((book) => {
    return Object.values(book.variants).map((variant) => {
      return {
        story: book.slug,
        variant: variant.slug,
      };
    });
  });

  return prerenderStories.flat();
};
