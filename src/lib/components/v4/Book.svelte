<script lang="ts">
  import type { StoryDefinition } from "$lib/book.js";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  const stories = writable<StoryDefinition[]>([]);

  setContext("bookemoji.stories", stories);
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
  :global(body) {
    margin: 0;
  }

  :global(.book-root .story-name, .book-root .story-list) {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  :global(.book-header :where(h1, h2, h3, h4, h5, h6)) {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    margin: 0;
    font-size: 1.5em;
  }
</style>
