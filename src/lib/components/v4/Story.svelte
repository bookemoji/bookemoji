<script lang="ts">
  import type { StoryDefinition } from "$lib/book.js";
  import { getContext, onMount, type Component } from "svelte";
  import { writable, type Writable } from "svelte/store";

  export let name: string;
  export let of: Component;
  export let args: Record<string, any> = {};

  const stories = getContext<Writable<StoryDefinition[]>>("bookemoji.stories") ?? _throw();

  onMount(() => {
    let _comp = of;

    const story: StoryDefinition = { name, component: _comp, args, argTypes: {} };

    stories.update((currentStories) => [...currentStories, story]);
    return () => {
      stories.update((currentStories) => currentStories.filter((s) => s.name !== name));
    };
  });

  function _throw(): Writable<StoryDefinition[]> {
    throw new Error("No stories context found");
  }
</script>

<div class="story-root">
  <h5 class="story-name">{name}</h5>
  <div class="story" data-name={name}>
    <slot {args}>
      <svelte:component this={of} {...args} />
    </slot>
  </div>
</div>

<style>
  .story {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 1rem;
    background-color: #fff;
  }

  .story-root {
    margin-bottom: 0.5rem;
  }

  .story-name {
    margin-bottom: 0rem;
  }
</style>
