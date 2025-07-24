<script lang="ts">
  import { run } from "svelte/legacy";

  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  interface Props {
    name: string;
    /**
     * Whether the story matching name is to be solely displayed
     */
    isIsolated?: boolean;
    /**
     * Whether the story is to be displayed because a narrower slice wasn't provided
     * @readonly
     */
    isVisible?: boolean;
    children?: import("svelte").Snippet;
  }

  let { name, isIsolated = $bindable(false), isVisible = $bindable(false), children }: Props = $props();
  const fallback = writable(undefined);

  const view = getContext<Readable<string>>("bookemoji.isolate") ?? fallback;

  // todo
  run(() => {
    isIsolated = $view === name;
  });
  run(() => {
    isVisible = $view === undefined;
  });
</script>

{#if isIsolated || isVisible}
  {@render children?.()}
{/if}
