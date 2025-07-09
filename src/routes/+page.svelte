<script lang="ts">
  import { base } from "$app/paths";
  import Hero from "$lib/website/components/Hero.svelte";
  import Icon from "$lib/website/icons/Icon.svelte";
  import { wait } from "$lib/website/renderer-utils.js";

  // import type { PageData } from "./$types.js";

  // export let data: PageData;
  import { MetaTags } from "svelte-meta-tags";

  let copied: boolean = false;
  let lastClicked: number = Date.now();
  async function copy() {
    lastClicked = Date.now();
    await navigator.clipboard.writeText(document.querySelector(".npm-command")?.textContent?.trim() ?? "");
    if ("vibrate" in navigator) {
      await navigator.vibrate(50);
    }

    if (!copied) {
      copied = true;
    }
    await wait(1200);

    if (Date.now() - lastClicked > 1000) {
      copied = false;
    }
  }
</script>

<MetaTags title="bookemoji" />

<Hero>
  <div class="hero">
    <h1 class="brand-font brand-color">BookEmoji</h1>
    <h2>a component workshop for SvelteKit</h2>
    <h4 class="copy-cmd">
      <code class="npm-command">npm create bookemoji@latest</code>
      <button type="button" on:click={copy} class="copy-btn" data-rybbit-event="copy_npm_create_cmd">
        <Icon name={copied ? "check" : "content_copy"} size={"1.75rem"} color={copied ? "var(--teal-5)" : "currentColor"} />
      </button>
    </h4>
  </div>
</Hero>

<div class="side-by-side">
  <div class="about-bookemoji">
    <h3>About</h3>
    <p>
      📕 Bookemoji is a place to showcase, collaborate, and develop the technical aspects of user interfaces using <a
        href="https://svelte.dev/docs/kit/introduction#What-is-Svelte"
        target="_blank">svelte</a
      >
      and
      <a href="https://svelte.dev/docs/kit/introduction#What-is-SvelteKit" target="_blank">sveltekit</a>.
    </p>
  </div>

  <div>
    <h3>Features</h3>
    <ul class="book-list">
      <li>Flexible and strong integration with sveltekit</li>
      <li>Support for Svelte 4.x and 5.x</li>
      <li>unstyled components, style freely 🐎</li>
      <li>No JSX, no runtime React errors</li>
      <li>Low Dependencies</li>
      <li>Very little magic — enough for sorcerers to wield</li>
    </ul>
  </div>
</div>
<div class="cta-section">
  <a class="cta" href={`${base}/docs/getting-started`} data-rybbit-event="clicked_getting_started">Get Started</a>
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
    padding-bottom: 2rem;
  }

  @media screen and (min-width: 62rem) {
    .side-by-side {
      display: grid;
      grid-template-columns: max-content max-content;
      padding: 1rem 2rem 2rem 2rem;
      justify-content: center;
      gap: 2rem;
    }
  }

  @media screen and (min-width: 90rem) {
    .side-by-side {
      padding: 1rem 5vw 2rem 5vw;
      gap: 5vw;
    }
  }

  .book-list {
    padding: 0 0 0 1rem;
  }

  .npm-command {
    color: var(--link);
    padding: var(--size-2);
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

  .copy-cmd {
    position: relative;
  }

  .copy-btn {
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    align-self: stretch;
    background: var(--surface-1);
    border-color: var(--surface-1);
  }
  .npm-command {
    display: block;
    padding: var(--size-3) var(--size-6);
  }

  .cta-section {
    display: flex;
    justify-content: center;
    padding: 15vh 2rem 20vh 2rem;
    font-size: 3rem;
  }

  .cta {
    text-decoration: none;
    color: white;
    background: var(--gradient-27);
    text-shadow: 0 1px 0 var(--indigo-9);
    display: block;
    font-size: var(--font-size-3);
    padding-inline: var(--size-8);
    padding-block: var(--size-3);
    border-radius: var(--radius-2);
    box-shadow: var(--shadow-2);
  }
</style>
