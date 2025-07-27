<script lang="ts">
  import type { BookDefinition } from "$lib/book-emoji.js";
  import { getContext } from "svelte";
  import { writable, type Readable } from "svelte/store";

  const stories = getContext<Readable<BookDefinition[]>>("bookemoji.stories") ?? writable([]);

  export let expand: boolean = true;

  $: storiesGroupedMap = $stories.reduce(
    (groups, storyDef) => {
      const group = groups.get(storyDef.metadata.group) ?? [];

      groups.set(storyDef.metadata.group, [...group, storyDef]);

      return groups;
    },
    new Map<string, BookDefinition[]>([["", []]]),
  );

  $: hasGroups = storiesGroupedMap.size > 1;
</script>

<div class="story-list">
  <ul class="flush">
    {#if $stories.length === 0}
      <li>No stories available</li>
    {/if}
    <slot stories={$stories} {storiesGroupedMap}>
      {#each storiesGroupedMap as [group, stories]}
        {@const isDefaultGroup = group === ""}
        {#if !isDefaultGroup}
          <li data-group-name={group}>
            <slot name="group">
              <div class="story-group">
                {group}
              </div>
            </slot>
          </li>
        {/if}
        {#each stories as story}
          <li>
            <a class="story-list-item in-group" href={`${story.route}`}>{story.name}</a>
          </li>
          {#if expand}
            <li>
              <ul class="flush">
                {#each Object.values(story.variants) as variant}
                  <li>
                    <a class="story-variant-list-item in-group" href={`${variant.route}`}>{variant.name}</a>
                  </li>
                {/each}
              </ul>
            </li>
          {/if}
        {/each}
      {/each}
    </slot>
  </ul>
</div>

<style>
  .flush {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .flush :where(li:not(.story-group)) {
    padding: 0 0;
    margin: 0 0;
  }

  .story-list-item,
  .story-variant-list-item {
    display: block;
    text-decoration: none;
    padding: 0.5rem 1rem;
    padding-left: calc(var(--item-indent, 0) + 1rem);
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s;
  }

  .in-group {
    --item-indent: 1rem;
  }

  :where(.story-list-item, .story-variant-list-item):hover {
    background-color: var(--hover-bg);
  }

  .story-variant-list-item {
    padding-left: calc(var(--item-indent, 0) + 2rem);
  }
</style>
