<script lang="ts">
  /* the props */
  import "open-props/style";

  /* optional imports that use the props */
  import "open-props/normalize";
  import "open-props/buttons";

  import Header from "../Header.svelte";
  import type { LayoutData } from "./$types.js";
  import { base } from "$app/paths";
  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Jua&text=BookEmoji&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
    rel="stylesheet"
  />

  <link id="common-site-styles" rel="stylesheet" href={`${base}/site-and-docs.css`} />
</svelte:head>

<Header />

<div class="docs-root" class:main={data.hasHero}>
  <slot />
</div>

<style>
  .main {
    padding: 0 2rem;
  }
</style>
