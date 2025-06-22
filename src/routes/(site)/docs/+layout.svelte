<script lang="ts">
  import OpenProps from "open-props";
  import type { LayoutData } from "./$types.js";
  import { base } from "$app/paths";

  export let data: LayoutData;
</script>

<div class="docs">
  <aside class="toc">
    <h2 style:font-size={OpenProps.fontSize2}>Table of Contents</h2>

    <nav>
      <ol class="nav-links">
        {#each data.tableOfContents.entries() as [href, text]}
          <li>
            <a href={`${base}/docs/${href}`}>{text}</a>
          </li>
        {/each}
      </ol>
    </nav>
  </aside>
  <div class="doc-canvas">
    <slot />
  </div>
</div>

<style>
  .nav-links {
    list-style: none;
    padding: 0;
    margin-top: var(--size-2);
  }

  .nav-links :where(li) {
    padding-inline-start: 0;
  }

  .docs {
    --font-system-ui: "Space Grotesque", var(--font-system-ui, sans-serif);
    display: grid;
    gap: 2rem;
    grid-template-columns: 12rem auto;
    padding: 1rem 1rem;
  }

  .doc-canvas {
    padding: 1rem;
    background-color: var(--surface-1);
    border-radius: 24px;
  }

  .toc {
    position: sticky;
    top: 1rem;
    padding: 1rem;
    margin-top: calc(var(--font-lineheight-4) * var(--font-size-8));
  }

  :global(.shiki) {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 8px;
    display: block;
    max-inline-size: none;
    overflow-x: auto;
    font-size: 0.8em;
  }
</style>
