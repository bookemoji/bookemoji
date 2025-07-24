<script lang="ts">
  import { type BookDefinition } from "$lib/book-emoji.js";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { createKeyKeyMap } from "$lib/utils.js";

  interface Props {
    base?: string;
    books?: BookDefinition[];
    children?: import("svelte").Snippet;
  }

  let { base = "/books", books = [], children }: Props = $props();

  const stories = writable<BookDefinition[]>(books);

  setContext("bookemoji.stories", stories);
  setContext("bookemoji.base", base);
  setContext("bookemoji.meta", new Map());
  setContext("bookemoji.argTypes", createKeyKeyMap());
</script>

<div class="book-root">
  {@render children?.()}
</div>
