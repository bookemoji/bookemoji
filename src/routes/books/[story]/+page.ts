import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types.js";
import type { Component } from "svelte";
const books = import.meta.glob<{ default: Component }>("../stories/**/*.book.svelte", {
  eager: true,
});

export const load: PageLoad = async ({ params }) => {
  const { story } = params;
  if (!story) {
    return { status: 404, error: new Error("Story not found") };
  }

  try {
    // const book = await import(`../stories/${story}.book.svelte`);
    const [firstLetter, ...rest] = story.split("");
    const bookName = `${firstLetter.toUpperCase()}${rest.join("")}`;
    // const book = await import(`../stories/${bookName}.book.svelte`);
    console.log("Books", books);
    const book = books[`../stories/${bookName}.book.svelte`];

    if (!book) {
      error(404, `Book ${bookName} not found`);
    }

    console.log(`Loaded book: ${bookName}`, book.default);
    const component = book.default;
    return { Book: component, name: bookName };
  } catch (error) {
    console.error(`Error loading book ${story}:`, error);
    return { status: 404, error: new Error("Book not found") };
  }
};
