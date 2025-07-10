import type { Component, ComponentProps, ComponentType, SvelteComponent } from "svelte";
import type { Writable } from "svelte/store";

type OmittedComponentProps = "children" | "$$props" | "$$events" | "$$slots" | "$$rest" | "props";

export type MetaOptions<Comp extends SvelteComponent | Component<any, any>> = {
  reloadable?: boolean;
  component: Comp extends Component<infer P, any>
    ? Component<P, any>
    : Comp extends ComponentType<infer P>
      ? ComponentType<P>
      : ComponentType<SvelteComponent<Record<string, any>>>;
  args?: Comp extends Component<infer P, any>
    ? Omit<P, OmittedComponentProps>
    : Comp extends ComponentType<infer P>
      ? Omit<P, OmittedComponentProps>
      : Record<string, any>;
  argTypes?: Comp extends Component<infer P, any>
    ? Record<keyof Omit<P, OmittedComponentProps>, undefined | ArgTypeControl>
    : Comp extends ComponentType<infer P>
      ? Record<keyof Omit<P, OmittedComponentProps>, undefined | ArgTypeControl>
      : Record<string, undefined | ArgTypeControl>;
};

export type ArgTypeControl = SelectControl | TextControl | SwitchControl | NumberControl;

export type ComponentControl<T extends Component = Component> = {
  type: T;
  props?: ComponentProps<T>;
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
  argTypes?: Record<string, undefined | ArgTypeControl>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Record<string, any>;
};

export type ComponentMetaStore = Writable<Required<ComponentMeta>>;
