<script lang="ts">
  import { base } from "$app/paths";
  import type { PageData } from "./$types.js";

  export let data: PageData;
</script>

<svelte:head>
  <link rel="stylesheet" href="/blog.css" />
</svelte:head>

<div class="blog-content">
  {#if data.Content}
    <div class="article-and-sidebar">
      <div class="article">
        <data.Content.default />
      </div>
      <aside class="articles-sidebar">
        <h2>More Blog Posts</h2>
        <nav class="articles-list">
          <ul>
            {#each data.articles as article}
              <li>
                <a href={`${base}/blog/${article.slug}`}>{article.title}</a>
              </li>
            {/each}
          </ul>
        </nav>
      </aside>
    </div>
  {:else}
    <h1>Blog</h1>
    <p class="subtitle"><i>Musings of the bookemoji team</i></p>

    <h2>Posts</h2>
    <nav class="articles-list">
      <ul>
        {#each data.articles.filter((p) => p.published) as article}
          <li>
            <a href={`${base}/blog/${article.slug}`}>{article.title}</a>
          </li>
        {:else}
          <li>
            <p>Nothing posted yet. Check back later.</p>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</div>

<style>
  .subtitle {
    margin-top: -3rem;
    color: var(--stone-6);
  }
</style>
