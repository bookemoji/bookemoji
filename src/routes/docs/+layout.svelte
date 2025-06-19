<script lang="ts">
  /* the props */
  import "open-props/style";

  /* optional imports that use the props */
  import "open-props/normalize";
  import "open-props/buttons";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="docs">
  <aside>
    <h2>Table of Contents</h2>
  </aside>
  <div>
    <slot />
  </div>
</div>

<style>
  :global(:where(h1, h2, h3, h4, h5, h6)) {
    font-weight: var(--font-weight-4);
  }

  .docs {
    --font-system-ui: "Inter", var(--font-system-ui, sans-serif);
    display: grid;
    gap: 1rem;
    grid-template-columns: 16rem auto;
  }

  :global(.shiki) {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 8px;
  }
</style>
