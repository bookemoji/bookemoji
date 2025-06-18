<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  export let name: string;

  const view = getContext<Readable<string>>("bookemoji.isolate") ?? writable(name);

  $: isIsolated = $view === name || $view === undefined;
</script>

{#if isIsolated}
  <slot />
{/if}
