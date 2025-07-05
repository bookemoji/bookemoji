<script lang="ts">
  import { base } from "$app/paths";
  import TwoColumnLayout from "../../TwoColumnLayout.svelte";
  import type { PageData } from "./$types.js";

  export let data: PageData;
</script>

<TwoColumnLayout>
  <svelte:fragment slot="sidebar">
    <aside class="articles-sidebar">
      <h2>Posts</h2>
      <nav class="articles-list">
        <ul>
          {#each data.articles.filter((a) => a.published || data.showAll) as article}
            <li>
              <a href={`${base}/blog/${article.slug}`}>{article.title}</a>
            </li>
          {:else}
            <li>No posts yet</li>
          {/each}
        </ul>
      </nav>
    </aside>
  </svelte:fragment>

  <svelte:fragment>
    {#key data.slug}
      {#if data.Content}
        <div class="article-and-sidebar">
          <div class="article">
            <data.Content.default />
          </div>
        </div>
      {:else}
        <h1>Blog</h1>
        <p class="subtitle"><i>Musings and discussions</i></p>
      {/if}
    {/key}
  </svelte:fragment>
</TwoColumnLayout>

<style>
  .subtitle {
    margin-top: -3rem;
    color: var(--stone-6);
  }

  .articles-list ul {
    list-style: none;
    padding: 0 0;
    margin: 0.5rem 0;
  }

  .articles-list li {
    padding: 0;
    margin-bottom: 1em;
  }

  :global(.blog-content table) {
    width: 100%;
  }
</style>
