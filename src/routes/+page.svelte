<script lang="ts">
  import Hero from "$lib/website/components/Hero.svelte";
  import type { PageData } from "./$types.js";

  export let data: PageData;
</script>

<Hero>
  <div class="hero">
    <h1 class="brand-font">BookEmoji</h1>
    <h2>a component workshop for SvelteKit</h2>
  </div>
</Hero>

<div class="side-by-side">
  <div>
    <h3>What is it</h3>
    <p>
      📕 Bookemoji is a component workshop—a place to showcase, collaborate, and develop the technical aspects of user interfaces—for <a
        href="https://svelte.dev/docs/kit/introduction#What-is-Svelte"
        target="_blank">svelte</a
      >
      and
      <a href="https://svelte.dev/docs/kit/introduction#What-is-SvelteKit" target="_blank">sveltekit</a>
    </p>
  </div>

  <div>
    <h3>Vision</h3>
    <aside class="subtitle">initially: vision, later: features</aside>
    <ul class="book-list">
      <li>Flexible yet strong integration with sveltekit</li>
      <li>Support for Svelte 4.x and 5.x</li>
      <li>unstyled components, style freely 🐎</li>
      <li>No JSX, no obscure errors</li>
      <li>Low Dependencies</li>
      <li>Very little magic — enough for sorcerers to wield</li>
    </ul>
  </div>
</div>

<style>
  .hero :where(h1, h2) {
    margin: 0;
  }

  .hero :where(h1) {
    font-size: var(--font-size-fluid-3);
  }

  .hero :where(h2) {
    font-size: var(--font-size-fluid-2);
    max-inline-size: var(--size-header-3);
  }

  .side-by-side {
    margin: 2rem 0;
    padding-bottom: 20vh;
  }

  .subtitle {
    margin-top: -2.5em;
    font-style: italic;
    font-size: 1rem;
    color: var(--gray-6);
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 60rem) {
    .side-by-side {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }

  .book-list {
    padding: 0 0 0 1rem;
  }

  .book-list li:nth-of-type(4n) {
    list-style-type: "📕";
  }
  .book-list li:nth-of-type(4n - 1) {
    list-style-type: "📗";
  }
  .book-list li:nth-of-type(4n - 2) {
    list-style-type: "📘";
  }
  .book-list li:nth-of-type(4n - 3) {
    list-style-type: "📙";
  }
  .book-list li:nth-of-type(5n) {
    list-style-type: "📔";
  }
</style>
