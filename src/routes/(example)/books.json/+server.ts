import { json, type RequestHandler } from "@sveltejs/kit";
import { createServerGET } from "$lib/loaders.js";
import { findStoryFiles, type BookEndpointResponse } from "$lib/book-emoji.js";

export const GET: RequestHandler = async (event) => {
  const bookRes = await createServerGET()(event);
  const bookData: BookEndpointResponse = await bookRes.json();

  bookData.books = bookData.books.sort((a, b) => a.name.localeCompare(b.name));

  return json(bookData);
};

export const prerender = true;
