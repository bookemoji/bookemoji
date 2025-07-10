<script lang="ts">
  import type { LayoutData } from "./$types.js";
  import Book from "$lib/components/v4/Book.svelte";
  import StoryList from "$lib/components/v4/StoryList.svelte";
  import Collapsible from "$lib/website/components/Collapsible.svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { wait } from "$lib/website/renderer-utils.js";

  import Sparkle from "$lib/website/icons/Sparkle.svelte";
  export let data: LayoutData;

  let embellished: boolean = false;
  let animating: boolean = false;
  let sparkles: (readonly [x: number, y: number, duration: number, delay: number, finalScale: number])[] = [];
  let sidebarRef: HTMLElement;

  $: makeItSparkle(embellished);

  async function makeItSparkle(_embellished: boolean) {
    if (browser && _embellished && sparkles.length === 0) {
      const total = 50 + Math.floor(Math.random() * 50);
      const bounds = sidebarRef.getBoundingClientRect();

      const animations = Array.from({ length: total }, (i) => {
        const duration: number = 500 + Math.floor(Math.random() * 2000);
        const delay = Math.random() > 0.8 ? Math.random() * 600 : 0;
        const coord = [
          -0.5 + Math.floor(Math.random() * bounds.width * 2),
          -0.5 + Math.floor(Math.random() * bounds.height * 1.5),
          duration,
          delay,
          0.2 + Math.random() * 0.6,
        ] as const;
        sparkles = [...sparkles, coord];
        return wait(duration);
      });

      await Promise.allSettled(animations);
      sparkles = [];
    }
  }
</script>

<Book base={data.base} books={data.books}>
  <div class="book-layout" class:embellished class:animating on:animationstart={() => (animating = true)} on:animationend={() => (animating = false)}>
    <div class="sidebar" bind:this={sidebarRef} class:sparkling={sparkles.length > 0}>
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

<div class="sparkle-overlay" class:active={sparkles.length > 0}>
  {#each sparkles as [x, y, duration, delay, finalScale]}
    <div class="sparkle" style:left={`${x}px`} style:top={`${y}px`} style:animation-delay={`${delay}ms`} style:animation-duration={`${duration}ms`}>
      <Sparkle scale={finalScale} />
    </div>
  {/each}
</div>

<style>
  .book-layout {
    display: grid;
    grid-template-columns: 18rem 1fr;
    min-height: 100vh;
    overflow: hidden;
    border-top: 1px solid var(--surface-2);
  }

  .sidebar {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--surface-2);
    background: var(--surface-1);
    transition: 0.1s ease-in filter;
    filter: blur(0) saturate(1) brightness(1);
  }

  @media (prefers-color-scheme: light) {
    .sidebar.sparkling {
    }
  }

  @media (prefers-color-scheme: dark) {
    .sidebar.sparkling {
      filter: blur(0) saturate(4) brightness(2.5);
      box-shadow: 0px 0px 40px var(--surface-3);
      transition: 0.8s ease-in all;
    }
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

  .sparkle-overlay {
    position: absolute;
    font-size: 1em;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: none;
    pointer-events: none;
  }

  .sparkle {
    font-size: 2rem;
    position: fixed;
    transition: ease-in-out all;
  }

  .sparkle-overlay.active {
    display: block;
    background-color: rgba(255, 255, 255, 0.05);
  }

  @keyframes sparkle-appear {
    0% {
      opacity: 0;
      transform: scale(0, 0);
    }
    20% {
      opacity: 0;
      transform: scale(0.7, 1.2);
    }
    30% {
      transform: scale(1.1, 0.8);
    }
    40% {
      transform: scale(0.9, 1.05);
    }
    50% {
      transform: scale(1.05, 0.95);
    }
    60% {
      opacity: 1;
      transform: scale(1, 1);
    }

    100% {
      opacity: 0;
      transform: scale(0, 0);
    }
  }

  .sparkle {
    animation: sparkle-appear 1s cubic-bezier(0.5, 1.5, 0.5, 1) both;
  }
</style>
