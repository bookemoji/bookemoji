<script lang="ts">
  import { nameToId } from "$lib/book-emoji.js";
  import { type SvelteComponent, type Component, getContext } from "svelte";

  interface Props {
    name: string;
    of: Component;
    args?: Record<string, any>;
    children?: import("svelte").Snippet<[any]>;
  }

  let { name, of, args = {}, children }: Props = $props();

  let MyComponent: Component = $state(of);

  let root: HTMLDivElement;

  let id = $derived(nameToId(name));
</script>

<div class="story" {id}>
  {#if children}
    {@render children({ args })}
  {:else}
    <MyComponent {...args} />
  {/if}
</div>

<style>
</style>
