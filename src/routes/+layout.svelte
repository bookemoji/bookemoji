<script lang="ts">
  /* the props */
  import "open-props/style";

  /* optional imports that use the props */
  import "open-props/normalize";
  import "open-props/buttons";

  import Header from "./Header.svelte";
  import type { LayoutData } from "./$types.js";
  import { MetaTags } from "svelte-meta-tags";
  import { descriptionLookup, titleLookup, titlify } from "$lib/website/metatags.js";
  import { page } from "$app/stores";

  export let data: LayoutData;

  $: title = titlify($page.url.pathname);
  $: titleTemplate = $page.url.pathname === "/" ? "" : "bookemoji › %s";
  $: description = descriptionLookup[$page.url.pathname] ?? "";
</script>

<MetaTags {titleTemplate} {title} {description} />

<Header />

<div class="docs-root" class:main={data.hasHero}>
  <slot />
</div>

<style>
  .main {
    padding: 0 2rem;
  }
</style>
