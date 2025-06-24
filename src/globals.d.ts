// addapted from this, but to support as mdx instead of svx
// /// <reference types="mdsvex/globals" />

declare module "*.mdx" {
  import type { SvelteComponent } from "svelte";

  export default class Comp extends SvelteComponent {}

  export const metadata: Record<string, unknown>;
}
