<script lang="ts">
  import { nameToId } from "$lib/book-emoji.js";
  import { type Component } from "svelte";

  export let name: string;
  export let of: Component;
  export let args: Record<string, any> = {};

  let id = nameToId(name);
</script>

<div class="story-root" {id}>
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
