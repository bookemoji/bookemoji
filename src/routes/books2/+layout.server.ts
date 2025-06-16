import type { BookDefinition } from "$lib/book-emoji.js";
import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({ fetch }) => {
  const bookRes = await fetch("/books");
  const bookList: BookDefinition[] = await bookRes.json();

  // Sort books by name
  //   bookList.sort((a, b) => a.name.localeCompare(b.name));

  return { bookList };
};
