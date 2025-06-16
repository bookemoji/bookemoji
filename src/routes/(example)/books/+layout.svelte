<script lang="ts">
  import type { LayoutData } from "./$types.js";
  import Book from "$lib/components/v4/Book.svelte";
  import StoryList from "$lib/components/v4/StoryList.svelte";

  export let data: LayoutData;
</script>

<Book base="/books2" books={data.bookList}>
  <div class="book-layout">
    <div class="book-sidebar">
      <a href="/">Back to Docs</a>
      <div class="book-header">
        <h4>Stories</h4>
      </div>
      <StoryList />
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
    gap: 1rem;
    height: 100vh;
    overflow: hidden;
  }
  .book-sidebar {
    border-right: 1px solid #ccc;
  }

  .book-header {
    padding: 1rem;
    border-bottom: 1px solid #ccc;
    margin: 0;
  }
</style>
