<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  export let name: string;
  const fallback = writable(name);

  const view = getContext<Readable<string>>("bookemoji.isolate") ?? fallback;

  $: isIsolated = $view === name || $view === undefined;
</script>

{#if isIsolated}
  <slot />
{/if}
