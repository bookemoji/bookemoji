<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/website/icons/Icon.svelte";
  import TwoColumnLayout from "../../TwoColumnLayout.svelte";
  import type { PageData } from "./$types.js";
  import { page } from "$app/stores";

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
              <a href={`${base}/blog/${article.slug}`} class:active={`${base}/blog/${article.slug}` === $page.url.pathname}>{article.title}</a>
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
      {#if data.page}
        <div class="article-and-sidebar">
          <div class="article">
            <h1>{data.page.metadata.title}</h1>
            <div class="metadata">
              <div class="date-posted">
                <Icon name="event" size="1rem" color="var(--brand)" />
                {new Date(data.page.metadata.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div class="author">
                <Icon name="article_person" size="1rem" color="var(--brand)" />
                {data.page.metadata.author}
              </div>
            </div>
            <data.page.Content />
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

  .metadata {
    display: flex;
    gap: 3rem;
    margin-top: -2rem;
    margin-bottom: 2rem;
    color: var(--brand);
  }

  .author,
  .date-posted {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .articles-list ul {
    list-style: none;
    padding: 0 0;
    margin: 0.5rem 0;
  }

  .articles-list li {
    padding: 0;
  }

  .articles-list a {
    display: block;
    padding: 0.5rem 1rem;
    margin: 0 -1rem 0 -1rem;
  }

  .articles-list a.active {
    background: var(--surface-2);
  }

  :global(.blog-content table) {
    width: 100%;
  }
</style>
