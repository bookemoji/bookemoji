<script lang="ts">
  import type { LayoutData } from "./$types.js";
  import Book from "$lib/components/v4/Book.svelte";
  import StoryList from "$lib/components/v4/StoryList.svelte";
  export let data: LayoutData;
</script>

<Book base={data.base} books={data.books}>
  <div class="book-layout">
    <div class="book-sidebar">
      <div class="brand-header">
        <h1 class="brand-title">Your Brand Here</h1>
      </div>

      <StoryList --border-color={"var(--surface-2)"} />
      {#each data.books as story}
        <li>
          {story.name}
          <a href={story.route}>{story.slug}</a>
        </li>
      {/each}
    </div>
    <div class="book-canvas">
      <slot />
    </div>
  </div>
</Book>

<style>
  .book-layout {
    display: grid;
    grid-template-columns: 12rem 1fr;
    min-height: 100vh;
    overflow: hidden;
    border-top: 1px solid var(--surface-2);
  }
  .book-sidebar {
    border-right: 1px solid var(--surface-2);
  }

  .brand-header {
    display: block;
    text-decoration: none;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid var(--surface-2);
  }

  .brand-header .brand-title {
    margin: 0;
  }

  .book-canvas {
    padding: 2rem;
  }
</style>
