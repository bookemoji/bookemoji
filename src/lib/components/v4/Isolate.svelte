<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  export let name: string;

  /**
   * Whether the story matching name is to be solely displayed
   */
  export let isIsolated: boolean = false;

  /**
   * Whether the story is to be displayed because a narrower slice wasn't provided
   * @readonly
   */
  export let isVisible: boolean = false;
  const fallback = writable(undefined);

  const view = getContext<Readable<string>>("bookemoji.isolate") ?? fallback;

  $: isIsolated = $view === name;
  $: isVisible = $view === undefined;
</script>

{#if isIsolated || isVisible}
  <slot />
{/if}
