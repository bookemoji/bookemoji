<script lang="ts">
  /* the props */
  import "open-props/style";

  /* optional imports that use the props */
  import "open-props/normalize";
  import "open-props/buttons";

  import Header from "$lib/website/components/Header.svelte";
  import Footer from "$lib/website/components/Footer.svelte";
  import type { LayoutData } from "./$types.js";
  import { MetaTags } from "svelte-meta-tags";
  import { descriptionLookup, titlify } from "$lib/website/metatags.js";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  export let data: LayoutData;

  $: title = titlify($page.url.pathname);
  $: titleTemplate = $page.url.pathname === "/" ? "" : "bookemoji › %s";
  $: description = descriptionLookup[$page.url.pathname] ?? "";

  let version: string = ``;

  const getVersion = async () => {
    const response = await fetch("https://registry.npmjs.org/bookemoji/latest");
    if (response.ok) {
      const data = await response.json();
      version = `v${data.version}`;
    }
  };

  onMount(() => {
    window.requestIdleCallback(() => {
      getVersion();
    });
  });
</script>

<MetaTags {titleTemplate} {title} {description} />

<Header {version} />

<div class="docs-root" class:main={data.hasHero}>
  <slot />
</div>

<Footer />

<style>
  .main {
    padding: 0 2rem;
  }
</style>
