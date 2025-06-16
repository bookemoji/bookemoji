import { json, type RequestHandler } from "@sveltejs/kit";
import { findStoryFiles } from "$lib/book-emoji.js";
import type { Component } from "svelte";

export const GET: RequestHandler = async () => {
  const books = import.meta.glob<{ default: Component }>("./stories/**/*.book.svelte", {
    eager: true,
  });

  const bookList = await findStoryFiles("/books2", books);

  return json(bookList);
};
