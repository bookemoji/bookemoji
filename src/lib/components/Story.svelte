<script lang="ts">
  import type { SvelteComponent, Component } from "svelte";

  interface Props {
    name: string;
    of: Component;
    args?: Record<string, any>;
    children?: import("svelte").Snippet<[any]>;
  }

  let { name, of, args = {}, children }: Props = $props();

  let MyComponent: Component = $state(of);

  let root: HTMLDivElement;
</script>

<div class="story">
  {#if children}
    {@render children({ args })}
  {:else}
    <MyComponent {...args} />
  {/if}
</div>

<style>
</style>
