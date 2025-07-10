<script lang="ts">
  import type { LayoutData } from "./$types.js";
  import Book from "$lib/components/v4/Book.svelte";
  import StoryList from "$lib/components/v4/StoryList.svelte";
  import Collapsible from "$lib/website/components/Collapsible.svelte";
  import { page } from "$app/stores";
  export let data: LayoutData;

  let embellished: boolean = false;
  let animating: boolean = false;
</script>

<Book base={data.base} books={data.books}>
  <div class="book-layout" class:embellished class:animating on:animationstart={() => (animating = true)} on:animationend={() => (animating = false)}>
    <div class="sidebar">
      {#if embellished}
        <div class="book-sidebar">
          <div class="brand-header">
            <h1 class="brand-title">Your Brand Here</h1>
          </div>
          <div class="embellish-area">
            <label>
              <input id="enable-customizations" type="checkbox" bind:checked={embellished} />
              Show Customization
            </label>
          </div>
          <!-- When embellished / customized, we just build the <StoryList> ourselves, but style it how we please -->
          {#each data.books as book}
            <div class="book-item">
              <Collapsible open>
                <svelte:fragment slot="header">
                  <a class="book-title" href={book.route} class:active={$page.url.pathname === book.route}>{book.name}</a>
                </svelte:fragment>

                {#each Object.entries(book.variants) as [path, variant]}
                  <div class="variant-item">
                    <a class="variant-title" href={variant.route} class:active={$page.url.pathname === variant.route}>{variant.name}</a>
                  </div>
                {/each}
              </Collapsible>
            </div>
          {/each}
        </div>
      {:else}
        <div class="book-sidebar">
          <div class="brand-header">
            <h1 class="brand-title">Your Brand Here</h1>
          </div>
          <div class="embellish-area">
            <label>
              <input id="enable-customizations" type="checkbox" bind:checked={embellished} />
              Show Customization
            </label>
          </div>
          <StoryList --border-color={"var(--surface-2)"} />
        </div>
      {/if}
    </div>
    <div class="book-canvas">
      <slot />
    </div>
  </div>
</Book>

<style>
  .book-layout {
    display: grid;
    grid-template-columns: 13rem 1fr;
    min-height: 100vh;
    overflow: hidden;
    border-top: 1px solid var(--surface-2);
  }

  .sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--surface-2);
    background: var(--surface-1);
  }

  .book-layout.embellished {
    grid-template-columns: 18rem 1fr;
  }

  .embellished .book-canvas {
    padding: 5vh 10vw;
  }

  .embellished .book-sidebar {
    background: var(--surface-1);
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

  .embellish-area {
    border-bottom: 1px solid var(--surface-2);
  }

  .embellish-area label {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    justify-content: center;
  }

  .embellish-area:hover {
    background: var(--surface-2);
  }

  .variant-item {
    --link: var(--stone-7);
    --link-visited: var(--stone-9);
    padding: 0.25rem 1rem;
    border-bottom: 1px solid var(--surface-2);
  }

  .variant-item:last-of-type {
    border-bottom: none;
  }

  .book-item {
    --link: var(--indigo-4);
    --link-visited: var(--indigo-4);
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-weight: 200;
    border-bottom: 1px solid vaR(--surface-2);
  }

  .book-title {
    display: block;
    font-weight: 600;
    padding-inline-start: 0.5rem;
  }

  :where(.book-title, .variant-title) {
    display: block;
  }

  :where(.book-title, .variant-title).active {
    --link: var(--pink-6);
  }
</style>
