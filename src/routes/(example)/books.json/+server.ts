import { json, type RequestHandler } from "@sveltejs/kit";
import { findStoryFiles } from "$lib/book-emoji.js";
import type { Component } from "svelte";

export const GET: RequestHandler = async () => {
  const books = import.meta.glob<{ default: Component }>("../books/stories/**/*.book.svelte", {
    eager: true,
  });

  const bookList = await findStoryFiles("/books", books);

  return json(bookList);
};

export const prerender = true; // Enable prerendering for this route
