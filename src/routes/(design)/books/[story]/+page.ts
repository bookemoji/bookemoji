import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types.js";
import type { Component } from "svelte";
// import { join, resolve } from "path";
import { browser } from "$app/environment";
// const books = import.meta.glob<{ default: Component }>("../stories/**/*.book.svelte", {
//   eager: true,
// });

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const { story } = params;

  if (!story) {
    error(404, `Book ${story} not found`);
  }

  const { bookList } = await parent();

  const book = bookList.find((b: { name: string }) => b.name.toLowerCase() === story.toLowerCase());

  if (!book) {
    error(404, `Book ${story} not found in booklist`);
  }

  if (browser) {
    // In the browser, we can directly import the component
    const bookComponent = await import(`../stories/${book.name}.book.svelte`);
    ``;
    return { Book: bookComponent.default, name: book.name };
  } else {
    return {
      component: null, // No component in SSR context
      bookPath: book.path,
      name: book.name,
    };
  }

  // if (book.component) {
  //   console.log(`Loaded book component: ${book.name}`, book.component);
  //   return { Book: book.component, name: book.name };
  // } else {
  //   const component = await import(join("../", book.path));

  //   if (!component.default) {
  //     error(404, `Component for book ${story} not found`);
  //   }
  //   console.log(`Loaded book component: ${book.name}`, component.default);
  //   return { bookPath: join("../", book.path), name: book.name };
  // }
};
