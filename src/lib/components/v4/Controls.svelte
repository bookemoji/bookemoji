<script lang="ts">
  import { getMeta, type ArgTypeControl } from "$lib/book-emoji.js";
  import type { Component, ComponentProps, ComponentType } from "svelte";

  export let of: Component;

  const meta = getMeta<typeof of>(of);

  $: argTypes = Object.entries($meta.argTypes).filter(
    (kvp): kvp is [string, ArgTypeControl] => kvp[1] !== undefined,
  );
</script>

<div class="controls">
  {#each argTypes as [key, control]}
    <div class="control">
      <label for={key}>{key}</label>
      {#if control.type === "select"}
        <select bind:value={$meta.args[key]}>
          {#each control.options as option}
            <option value={option}>{option}</option>
          {:else}
            <option disabled selected>No options</option>
          {/each}
        </select>
      {:else if control.type === "text"}
        <input id={key} type="text" bind:value={$meta.args[key]} />
      {:else if control.type === "boolean"}
        <input id={key} type="checkbox" bind:checked={$meta.args[key]} />
      {/if}
    </div>
  {/each}
</div>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
