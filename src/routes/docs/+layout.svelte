<script lang="ts">
  import OpenProps from "open-props";
  import type { LayoutData } from "./$types.js";
  import TwoColumnLayout from "../TwoColumnLayout.svelte";

  export let data: LayoutData;
</script>

<div class="docs">
  <TwoColumnLayout>
    <svelte:fragment slot="sidebar">
      <aside class="toc">
        <h2 style:font-size={OpenProps.fontSize2}>Table of Contents</h2>
        <nav>
          <ol class="nav-links">
            {#each data.tableOfContents.entries() as [href, text]}
              <li>
                <a href={`/docs/${href}`}>{text}</a>
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

  .docs {
    --font-system-ui: "Space Grotesque", var(--font-system-ui, sans-serif);
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
