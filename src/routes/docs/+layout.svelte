<script lang="ts">
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
      <img
        class="flavor-img"
        src="{base}/img/flavors/middle_book_ghost.svg"
        width="120px"
        alt="A ghost flying out of a book for stylistic embellishment of the page"
      />
    </div>
  </TwoColumnLayout>
</div>
<div class="page-footer docs-footer">
  <div class="docs-footer-group">
    <div class="doc-footer-p">
      Is this page missing something?
      <a href="https://github.com/bookemoji/bookemoji/issues" target="_blank">Open an issue on GitHub</a>
    </div>
  </div>
</div>

<style>
  .doc-canvas {
    position: relative;
    padding-bottom: 25vh;
  }
  .flavor-img {
    position: absolute;
    bottom: -1rem;
    display: block;
    left: -3rem;
    /* margin: auto; */
    filter: saturate(0);
    transform: rotate(55deg);
    opacity: 0.25;
  }

  .docs-footer-group {
    margin: auto;
    display: grid;
    align-items: center;
  }

  .doc-footer-p {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .docs-footer {
    color: var(--stone-6);
  }

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
    border-bottom: 1px solid var(--surface-2);
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
