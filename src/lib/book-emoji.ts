import { browser } from "$app/environment";
import { getContext, type Component, type ComponentProps } from "svelte";
import { base as siteBase} from "$app/paths";
import { writable, type Writable } from "svelte/store";

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
    const route = `${siteBase}${base}/${slug}`;

    return {
      path,
      name,
      route,
      slug,
    } satisfies BookDefinition;
  });

  return bookList;
};

export type MetaOptions<T extends Component> = {
  component: Component;
  args?: Omit<ComponentProps<T>, "children" | "$$props" | "$$events" | "$$slots" | "$$rest">;
  argTypes?: Record<
    keyof Omit<ComponentProps<T>, "children" | "$$props" | "$$events" | "$$slots" | "$$rest">,
    undefined | ArgTypeControl
  >;
};

export type ArgTypeControl = ComponentControl | SelectControl | TextControl | SwitchControl;

export type ComponentControl<T extends Component = Component> = {
  type: T;
  props: ComponentProps<T>;
};

export type SelectControl = {
  type: "select";
  options: string[];
};

export type SwitchControl = {
  type: "boolean";
};

export type TextControl = {
  type: "text";
};

export type ComponentArgTypes = {
  argTypes?: Record<string, undefined | ArgTypeControl>;
  args?: Record<string, any>;
};

export type ComponentArgStore = Writable<Required<ComponentArgTypes>>;

export function defineMeta<T extends Component>(definition: MetaOptions<T>) {
  if (!browser) {
    return;
  }
  const metas = getContext<Map<Component, ComponentArgStore>>("bookemoji.metas");

  if (!metas) {
    throw new Error(
      `No "bookemoji.metas" context found. Make sure to set the context in your book component at the top level.`,
    );
  }

  const { component, ...componentArgs } = definition;

  const initialArgStore: Required<ComponentArgTypes> = {
    args: componentArgs.args ?? {},
    argTypes: componentArgs.argTypes ?? {},
  };

  metas.set(component, writable(initialArgStore));
}

export function getMeta<T extends Component>(component: T): ComponentArgStore {
  if (!browser) {
    return writable({
      args: {},
      argTypes: {},
    }) as ComponentArgStore;
  }

  const metas = getContext<Map<Component, ComponentArgStore>>("bookemoji.metas");
  const argData = metas.get(component);
  if (!argData) {
    throw new Error(
      `No "bookemoji.metas" context found. Make sure your Story, Control, etc is within a <Book>`,
    );
  }
  return argData;
}
