<script lang="ts">
  import type { BookDefinition } from "$lib/book-emoji.js";
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  const stories = getContext<Readable<BookDefinition[]>>("bookemoji.stories") ?? writable([]);

  interface Props {
    expand?: boolean;
    children?: import("svelte").Snippet<[{ stories: BookDefinition[] }]>;
  }

  let { expand = true, children }: Props = $props();
</script>

<div class="story-list">
  <ul class="flush">
    {#if $stories.length === 0}
      <li>No stories available</li>
    {/if}
    {#if children}{@render children({ stories: $stories })}{:else}
      {#each $stories as story}
        <li>
          <a class="story-list-item" href={`${story.route}`}>{story.name}</a>
        </li>
        {#if expand}
          <li>
            <ul class="flush">
              {#each Object.values(story.variants) as variant}
                <li>
                  <a class="story-variant-list-item" href={`${variant.route}`}>{variant.name}</a>
                </li>
              {/each}
            </ul>
          </li>
        {/if}
      {/each}
    {/if}
  </ul>
</div>

<style>
  .flush {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .flush li {
    padding: 0 0;
    margin: 0 0;
  }

  .story-list-item,
  .story-variant-list-item {
    display: block;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s;
  }

  :where(:global(.story-list-item, .story-variant-list-item)):hover {
    background-color: var(--hover-bg);
  }

  .story-variant-list-item {
    padding-left: 2rem;
  }
</style>
