import type { Component } from "svelte";

export type StoryDefinition = {
  name: string;
  componentName: string;
  argTypes: Record<string, any>;
  args: Record<string, any>;
  component: Component;
};
