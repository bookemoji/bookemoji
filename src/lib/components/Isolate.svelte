<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  interface Props {
    name: string;
    children?: import("svelte").Snippet;
  }

  let { name, children }: Props = $props();

  const view = getContext<Readable<string>>("bookemoji.isolate") ?? writable(name);

  let isIsolated = $derived($view === name || $view === undefined);
</script>

{#if isIsolated}
  {@render children?.()}
{/if}
