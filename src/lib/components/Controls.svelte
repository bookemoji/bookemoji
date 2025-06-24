<script lang="ts">
  import { getMeta, type ArgTypeControl } from "$lib/book-emoji.js";
  import type { Component } from "svelte";
  import Isolate from "./Isolate.svelte";

  interface Props {
    of: Component;
    story: string;
  }

  let { of, story }: Props = $props();

  const meta = getMeta<typeof of>(of, story);

  let argTypes = $derived(Object.entries($meta.argTypes).filter((kvp): kvp is [string, ArgTypeControl] => kvp[1] !== undefined));
</script>

<Isolate name={story}>
  <fieldset class="controls">
    <legend class="controls-title">Controls</legend>
    {#each argTypes as [key, control]}
      <div class="form-group">
        <label class="control">
          <span>{key}</span>
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
        </label>
      </div>
    {/each}
  </fieldset>
</Isolate>
