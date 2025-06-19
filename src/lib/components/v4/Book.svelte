<script lang="ts">
  import { loadStories, type BookDefinition } from "$lib/book-emoji.js";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { createKeyKeyMap } from "$lib/utils.js";

  export let base: string = "/books";
  export let books: BookDefinition[] = [];

  const stories = writable<BookDefinition[]>(books);

  setContext("bookemoji.stories", stories);
  setContext("bookemoji.base", base);
  setContext("bookemoji.meta", new Map());
  setContext("bookemoji.argTypes", createKeyKeyMap());

  onMount(() => {
    if (books.length === 0) {
      loadStories(base).then((loadedStories) => {
        stories.set(loadedStories ?? []);
      });
    }
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Geo&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="book-root">
  <slot />
</div>

<style>
</style>
