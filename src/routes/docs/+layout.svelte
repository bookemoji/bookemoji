<script lang="ts">
  import OpenProps from "open-props";
  import type { LayoutData } from "./$types.js";
  import TwoColumnLayout from "../TwoColumnLayout.svelte";
  import { base } from "$app/paths";
  import { page } from "$app/stores";

  export let data: LayoutData;
</script>

<div class="docs">
  <TwoColumnLayout>
    <svelte:fragment slot="sidebar">
      <aside class="toc">
        <h2>Table of Contents</h2>

        <nav>
          <ol class="nav-links">
            {#each data.tableOfContents.entries() as [href, text]}
              <li>
                <a href={`${base}/docs/${href}`} class:active={`${base}/docs/${href}` === $page.url.pathname}>{text}</a>
              </li>
            {/each}
          </ol>
        </nav>
      </aside>
    </svelte:fragment>

    <div class="doc-canvas">
      <slot />
    </div>
    <svelte:fragment></svelte:fragment>
  </TwoColumnLayout>
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

  .nav-links a {
    display: block;
    padding: 0.5rem 1rem;
    margin: 0 -1rem 0 -1rem;
  }

  .nav-links a.active {
    background: var(--surface-2);
  }

  .toc {
    position: sticky;
    top: 1rem;
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
