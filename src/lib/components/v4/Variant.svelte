<script lang="ts">
  import { getStores } from "$app/stores";
  import type { VariantDefinition } from "$lib/book-emoji.js";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let variant: VariantDefinition;

  const view = setContext("bookemoji.isolate", writable(variant.name));
  const { page } = getStores();

  $: $view = $page.data?.variant?.name ?? "";
</script>

<slot />
