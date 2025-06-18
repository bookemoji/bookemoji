import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types.js";

export const load: LayoutLoad = async ({ params, parent }) => {
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

  return {
    Book: bookComponent.default,
    name: book.name,
  };
};
