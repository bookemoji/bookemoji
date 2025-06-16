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
  slug: string;
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
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load stories from ${path}`);
  }

  const data = await response.json();

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
  const bookList: BookDefinition[] = Object.entries(books).map(([localPath, mod]) => {
    const name = basename(localPath).replace(".book.svelte", "");
    const path = localPath;
    const slug = nameToId(name.toLowerCase());
    const route = `${base}/${slug}`;

    return {
      path,
      name,
      route,
      slug,
    } satisfies BookDefinition;
  });

  return bookList;
};
