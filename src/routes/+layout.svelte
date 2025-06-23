<script lang="ts">
  /* the props */
  import "open-props/style";

  /* optional imports that use the props */
  import "open-props/normalize";
  import "open-props/buttons";

  import Header from "./Header.svelte";
  import type { LayoutData } from "./$types.js";
  export let data: LayoutData;
</script>

<Header />

<div class="docs-root" class:main={data.hasHero}>
  <slot />
</div>

<style>
  .main {
    padding: 0 2rem;
  }
</style>
