import type { PageLoad, EntryGenerator } from "./$types.js";
import { findStoryFiles } from "$lib/book-emoji.js";
import type { Component } from "svelte";

export const load: PageLoad = async ({ parent }) => {
  const { Book, name } = await parent();
  return { Book, name };
};

export const entries: EntryGenerator = async () => {
  const books = import.meta.glob<{ default: Component }>("../stories/**/*.book.svelte", {
    eager: true,
  });

  const bookList = await findStoryFiles("/books", books);

  const prerenderStories = bookList.map((book) => ({
    story: book.slug,
  }));

  return prerenderStories;
};
