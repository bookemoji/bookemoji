/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from "$app/environment";
import { getContext, type SvelteComponent, type Component, type ComponentType } from "svelte";

import { get, writable, type Readable } from "svelte/store";
import type { KeyKeyMap } from "./utils.js";
import { render } from "svelte/server";
import { parse } from "node-html-parser";
import { base, loadStories } from "virtual:bookemoji";
import type { ComponentMeta, ComponentMetaStore, MetaOptions } from "./meta.js";

export type * from "./meta.js";
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
  return encodeURIComponent(name.replaceAll(" ", "-"));
};

export const createStoryUrl = (base: string, storyName: string) => {
  const story: string = nameToId(storyName.toLowerCase());
  const route: string = `${base}/${story}`;

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
  const variantParam: string = nameToId(variantName.toLowerCase());

  return {
    /**
     * The param value
     */
    story,
    /**
     * The param value
     */
    variantName,
    variantParam,
    route: `${base}/${story}/${variantParam}`,
  };
};

export const discoverVariants = (name: string, component: Component): string[] => {
  let html: string = "";
  if (component instanceof Function) {
    try {
      const result = render(component, { context: new Map([["bookemoji.meta", {}]]) });
      html = result.body;
    } catch (ex: unknown) {
      console.log(`Failed to SSR "${name}". Reason: "${(ex as Error).message}"`);
    }
  } else {
    html = `<p>Component was not renderable</p><p>Component is of type "${typeof component}"`;
  }
  // and alternative way to do this is to use the svelte/compiler parse — which may also be more stable
  const dom = parse(html);
  const variantNames = Array.from(dom.querySelectorAll(".story-root")).map((rootEl) => rootEl.attrs["data-story"]);

  return variantNames;
};

export type BookEndpointResponse = {
  /**
   * The base path of BookEmoji
   */
  base: `/${string}`;

  /**
   * The list of BookDefinitions found
   */
  books: BookDefinition[];
};

export const findStoryFiles = async () => {
  // const books: Record<string, Component> = import.meta.glob<Component>("./**/*.book.svelte", {
  //   eager: true,
  //   import: "default",
  // });
  const books: Record<string, Component> = await loadStories();

  const bookList: BookDefinition[] = Object.entries(books).map(([localPath, mod]) => {
    const name = basename(localPath).replace(".book.svelte", "");
    const path = localPath;
    const bookUrl = createStoryUrl(base, name);

    const variantNames = discoverVariants(name, mod);

    const variants: Record<string, VariantDefinition> = Object.fromEntries(
      variantNames.map((variant) => {
        const vrnt = createVariantUrl(base, name, variant);
        return [
          variant,
          {
            name: variant,
            route: vrnt.route,
            slug: vrnt.variantParam,
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

const SSR_ComponentMetaStore: ComponentMetaStore = writable({
  args: {},
  initialArgs: {},
  argTypes: {},
  ready: false,
}) as ComponentMetaStore;

export function defineMeta<Comp extends SvelteComponent | Component<any, any>>(definition: MetaOptions<Comp>) {
  if (!browser) {
    return;
  }

  const meta = getContext<Map<SvelteComponent | Component<any, any>, Required<ComponentMeta>>>("bookemoji.meta");
  const stories: Readable<BookDefinition[]> = getContext("bookemoji.stories");

  if (!meta) {
    throw new Error(`No "bookemoji.meta" context found. Make sure to set the context in your book component at the top level.`);
  }

  if (!stories) {
    throw new Error(`No "bookemoji.stories" context found. Make sure to set the context in your book component at the top level.`);
  }

  // find the current component BookDefinition by finding the story or story variant that has the current route path.
  const storyData = get(stories).find((b) => {
    // console.log(b, window.location.pathname);
    return (
      b.route === window.location.pathname.toLowerCase() ||
      Object.values(b.variants).find((v) => v.route === window.location.pathname.toLowerCase()) !== undefined
    );
  });

  if (storyData === undefined) {
    throw new Error(`Unable to find Story Data for current page - ${window.location.pathname}`);
  }

  const { component, ...componentArgs } = definition;

  const argData: Required<ComponentMeta> = {
    key: "initial",
    ready: false,
    initialArgs: structuredClone(componentArgs.args ?? {}),
    args: componentArgs.args ?? {},
    argTypes: componentArgs.argTypes ?? {},
    definition: storyData,
  };

  // @ts-expect-error the type here ultimately doesn't matter so not bothering
  meta.set(component, argData);
}

export function getMeta<T extends Component | ComponentType<SvelteComponent>>(component: T, variant: string): ComponentMetaStore {
  if (!browser) {
    return SSR_ComponentMetaStore;
  }

  const meta = getContext<Map<any, Required<ComponentMeta>>>("bookemoji.meta");
  const argData = getContext<KeyKeyMap<any, string, ComponentMetaStore>>("bookemoji.argTypes");
  // not needed rn:
  // const stories: Readable<BookDefinition[]> = getContext("bookemoji.stories");

  if (!argData || !meta) {
    throw new Error(`No "bookemoji.meta" context found. Make sure your Story, Control, etc is within a <Book>`);
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
