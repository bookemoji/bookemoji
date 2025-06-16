import type { Component } from "svelte";

export type StoryDefinition = {
  name: string;
  componentName: string;
  argTypes: Record<string, any>;
  args: Record<string, any>;
  component: Component;
};

export type BookDefinition = {
  name: string;
  path: string;
  route: string;
};

function basename(path: string): string {
  return path.split("/").pop() ?? "";
}

export const nameToId = (name: string): string => {
  return encodeURIComponent(name);
};

export const loadStories = async (path: string = "/books"): Promise<BookDefinition[]> => {
  //   const req = getRequestEvent();

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load stories from ${path}`);
  }

  const data = await response.json();

  console.log("loadStories:", data);

  return data;
};

export const findStoryFiles = async (
  base: string = "",
  books: Record<
    string,
    {
      default: Component;
    }
  >,
) => {
  //   const books = import.meta.glob<{ default: Component }>("./stories/**/*.book.svelte", {
  //     eager: true,
  //   });

  const bookList: BookDefinition[] = Object.entries(books).map(([localPath, mod]) => {
    console.log(mod.default);

    const name = basename(localPath).replace(".book.svelte", "");
    const path = localPath; //.replace("./stories/", "");
    const route = `${base}/${name.toLowerCase()}`;

    return {
      path,
      name,
      route,
      // component: mod.default,
    } satisfies BookDefinition;
  });

  return bookList;
};
