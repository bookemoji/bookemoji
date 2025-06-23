import { browser } from "$app/environment";
import { getContext, type Component, type ComponentProps } from "svelte";

import { writable, type Writable } from "svelte/store";
import type { KeyKeyMap } from "./utils.js";
import { render } from "svelte/server";
import { parse } from "node-html-parser";

/**
 * Represents a Story from SvelteKit's perspective
 */
export type BookDefinition = {
  name: string;
  slug: string;
  path: string;
  route: string;
  variants: Record<string, VariantDefinition>;
};

export type VariantDefinition = {
  name: string;
  slug: string;
  route: string;
};

function basename(path: string): string {
  return path.split("/").pop() ?? "";
}

export const nameToId = (name: string): string => {
  return encodeURIComponent(name);
};

export const createStoryUrl = (base: string, storyName: string) => {
  const story: string = nameToId(storyName.toLowerCase());
  const route: string = `/${base}/${story}`;
  return {
    /**
     * The param value
     */
    story,
    route,
  };
};

export const createVariantUrl = (base: string, storyName: string, variantName: string) => {
  const { story } = createStoryUrl(base, storyName);
  const variant: string = nameToId(variantName.toLowerCase());

  return {
    /**
     * The param value
     */
    story,
    /**
     * The param value
     */
    variant,
    route: `${base}/${story}/${variant}`,
  };
};

export const discoverVariants = (name: string, component: Component): string[] => {
  const result = render(component, { context: new Map([["bookemoji.meta", {}]]) });
  // and alternative way to do this is to use the svelte/compiler parse — which may also be more stable
  const dom = parse(result.body);
  const variantNames = Array.from(dom.querySelectorAll(".story-root")).map((rootEl) => rootEl.id);

  return variantNames;
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
    const bookUrl = createStoryUrl(base, name);

    const variantNames = discoverVariants(name, mod.default);

    const variants: Record<string, VariantDefinition> = Object.fromEntries(
      variantNames.map((variant) => {
        const vrnt = createVariantUrl(base, name, variant);
        return [
          variant,
          {
            name: variant,
            route: vrnt.route,
            slug: vrnt.variant,
          } satisfies VariantDefinition,
        ];
      }),
    );

    return {
      path,
      name,
      route: bookUrl.route,
      slug: bookUrl.story,
      variants,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Record<string, any>;
};

export type ComponentArgStore = Writable<Required<ComponentArgTypes>>;

export function defineMeta<T extends Component>(definition: MetaOptions<T>) {
  if (!browser) {
    return;
  }
  const meta = getContext<Map<Component, Required<ComponentArgTypes>>>("bookemoji.meta");

  if (!meta) {
    throw new Error(
      `No "bookemoji.meta" context found. Make sure to set the context in your book component at the top level.`,
    );
  }

  const { component, ...componentArgs } = definition;

  const argData: Required<ComponentArgTypes> = {
    args: componentArgs.args ?? {},
    argTypes: componentArgs.argTypes ?? {},
  };

  meta.set(component, argData);
}

export function getMeta<T extends Component>(component: T, variant: string): ComponentArgStore {
  if (!browser) {
    return writable({
      args: {},
      argTypes: {},
    }) as ComponentArgStore;
  }

  const meta = getContext<Map<Component, Required<ComponentArgTypes>>>("bookemoji.meta");
  const argData = getContext<KeyKeyMap<Component, string, ComponentArgStore>>("bookemoji.argTypes");

  if (!argData || !meta) {
    throw new Error(
      `No "bookemoji.meta" context found. Make sure your Story, Control, etc is within a <Book>`,
    );
  }

  let argTypes = argData.get(component, variant);

  if (!argTypes) {
    const defaultArgData = meta.get(component);
    if (!defaultArgData) {
      throw new Error(`defineMeta not called for component <Story name="${variant}" ... />`);
    }

    // populate initial value
    argTypes = writable(structuredClone(defaultArgData));
    argData.set(component, variant, argTypes);
  }

  return argTypes;
}
