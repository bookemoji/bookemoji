<script lang="ts">
  import type { StoryDefinition } from "$lib/book.js";
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  const stories: Readable<StoryDefinition[]> = getContext("bookemoji.stories") ?? writable([]);
</script>

<div class="story-list">
  <ul class="story-list-items">
    {#if $stories.length === 0}
      <li>No stories available</li>
    {/if}
    {#each $stories as story}
      <li>
        <a class="story-list-item" href={`#${story.name}`}>{story.name}</a>
      </li>
    {/each}
  </ul>
</div>

<slot />

<style>
  .story-list-items {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .story-list-items li {
    display: block;
  }

  .story-list-item {
    display: block;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #ccc;
    transition: background-color 0.2s;
  }

  .story-list-item:hover {
    background-color: #f0f0f0;
  }
</style>
