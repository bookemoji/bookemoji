<script lang="ts">
  /* the props */
  import openPropsStyle from "open-props/style?url";

  /* optional imports that use the props */
  import openPropsNormalize from "open-props/normalize?url";
  import openPropsButtons from "open-props/buttons?url";

  import Header from "../Header.svelte";
  import type { LayoutData } from "./$types.js";
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
  <link rel="stylesheet" href={openPropsStyle} />
  <link rel="stylesheet" href={openPropsNormalize} />
  <link rel="stylesheet" href={openPropsButtons} />
  <link id="common-site-styles" rel="stylesheet" href="/site-and-docs.css" />
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
