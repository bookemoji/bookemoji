import type { Component, ComponentProps, ComponentType, SvelteComponent } from "svelte";
import type { Writable } from "svelte/store";
import type { BookDefinition } from "./book-emoji.js";

/**
 * This is the type for the script *.book.svelte's module, as a way to define extra metadata about your book's story.
 * @example
 * ```svelte
 * <script context="module">
 *   export let metadata: BookMeta = { ... };
 * </script>
 * ```
 */
export interface BookMeta {
  group: string;
}

export type BookEmojiComponentFile = {
  default: Component;
  metadata?: BookMeta;
};

type OmittedComponentProps = "children" | "$$props" | "$$events" | "$$slots" | "$$rest" | "props";

// thanks, i hate these Infer_<Comp> types
type InferProps<Comp> =
  Comp extends Component<infer P, any>
    ? Omit<P, OmittedComponentProps>
    : Comp extends ComponentType<infer P>
      ? Omit<P, OmittedComponentProps>
      : Record<string, any>;

type InferComponent<Comp> =
  Comp extends Component<infer P, any>
    ? Component<P, any>
    : Comp extends ComponentType<infer P>
      ? ComponentType<P>
      : ComponentType<SvelteComponent<Record<string, any>>>;

export type InferArgTypes<Comp> =
  Comp extends Component<infer P, any>
    ? Record<keyof Omit<P, OmittedComponentProps>, undefined | ArgTypeControl>
    : Comp extends ComponentType<infer P>
      ? Record<keyof Omit<P, OmittedComponentProps>, undefined | ArgTypeControl>
      : Record<string, undefined | ArgTypeControl>;

export type MetaOptions<Comp extends SvelteComponent | Component<any, any>> = {
  reloadable?: boolean;
  component: InferComponent<Comp>;
  args?: InferProps<Comp>;
  argTypes?: InferArgTypes<Comp>;
};

export type ArgTypeControl = SelectControl | TextControl | SwitchControl | NumberControl | MultiSelectControl;

export type ComponentControl<T extends Component = Component> = {
  type: T;
  props?: ComponentProps<T>;
};

export type SelectControl = {
  type: "select";
  options: string[];
};

export type MultiSelectControl = {
  type: "multiselect";
  options: string[];
};

export type SwitchControl = {
  type: "boolean";
  disabled?: boolean;
};

export type TextControl = {
  type: "text";
};

export type NumberControl = {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
};

/**
 * The details about a component's stories, as set with defineMeta
 */
export type ComponentMeta = {
  key: string;
  ready: boolean;
  argTypes?: Record<string, undefined | ArgTypeControl>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Record<string, any>;
  initialArgs: Record<string, unknown>;
  definition: BookDefinition;
};

export type ComponentMetaStore = Writable<Required<ComponentMeta>>;
