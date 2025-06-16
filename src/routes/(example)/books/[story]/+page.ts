import { error } from "@sveltejs/kit";
import type { PageLoad, EntryGenerator } from "./$types.js";
import { findStoryFiles } from "$lib/book-emoji.js";
import type { Component } from "svelte";

export const load: PageLoad = async ({ params, parent }) => {
  const { story } = params;

  if (!story) {
    error(404, `Book ${story} not found`);
  }

  const { bookList } = await parent();

  const book = bookList.find((b: { name: string }) => b.name.toLowerCase() === story.toLowerCase());

  if (!book) {
    error(404, `Book ${story} not found in booklist`);
  }

  const bookComponent = await import(`../stories/${book.name}.book.svelte`);

  return { Book: bookComponent.default, name: book.name };
};

export const entries: EntryGenerator = async () => {
  const books = import.meta.glob<{ default: Component }>("../stories/**/*.book.svelte", {
    eager: true,
  });

  const bookList = await findStoryFiles("/books", books);

  const prerenderStories = bookList.map((book) => ({
    story: book.slug,
  }));
  console.log("Book List:", prerenderStories);

  return prerenderStories;
};
