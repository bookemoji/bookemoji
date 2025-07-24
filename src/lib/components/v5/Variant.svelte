<script lang="ts">
  import { getStores } from "$app/stores";
  import type { VariantDefinition } from "$lib/book-emoji.js";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  interface Props {
    variant: VariantDefinition;
    children?: import("svelte").Snippet;
  }

  let { variant, children }: Props = $props();

  const view = setContext("bookemoji.isolate", writable(variant.name));
  const { page } = getStores();

  $effect(() => {
    $view = $page.data?.variant?.name ?? "";
  });
</script>

{@render children?.()}
