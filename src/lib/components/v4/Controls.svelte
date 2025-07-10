<script lang="ts">
  import { getMeta, type ArgTypeControl, type NumberControl } from "$lib/book-emoji.js";
  import type { ComponentType, SvelteComponent } from "svelte";
  import Isolate from "./Isolate.svelte";
  import type { FormEventHandler } from "svelte/elements";

  export let of: ComponentType<SvelteComponent<any, any, any>>;
  export let story: string;
  export let reloadable: boolean = true;

  const meta = getMeta<typeof of>(of, story);

  $: argTypes = Object.entries($meta.argTypes).filter((kvp): kvp is [string, ArgTypeControl] => kvp[1] !== undefined);

  function onReload() {
    $meta.key = `${Date.now()}`;
  }

  function onNumberInput(key: string, control: NumberControl): FormEventHandler<HTMLInputElement> {
    return (event) => {
      if (control.required && event.currentTarget?.value === null) {
        event.currentTarget.value = `${control.min ?? 0}`;
      } else {
        // ensure a valid number shape
        const shape = parseInt(event.currentTarget.value, 10);
        if (!isNaN(shape)) {
          event.currentTarget.value = `${shape}`;
        } else {
          event.currentTarget.value = `${control.min ?? 0}`;
        }
      }
    };
  }
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
          {:else if control.type === "number"}
            <input id={key} {...control} bind:value={$meta.args[key]} on:input={onNumberInput(key, control)} />
          {/if}
        </label>
      </div>
    {/each}
    <div class="actions">
      {#if reloadable}
        <button type="button" on:click={onReload}> rerender </button>
      {/if}
    </div>
  </fieldset>
</Isolate>
