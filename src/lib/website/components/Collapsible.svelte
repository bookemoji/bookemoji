<script lang="ts">
  import { slide } from "svelte/transition";
  import Icon from "../icons/Icon.svelte";

  export let open: boolean = false;
  export let header: string = "";
</script>

<div class="">
  <div class="header">
    <slot name="header">
      {header}
    </slot>
    <button
      type="button"
      class="toggle"
      on:click={() => (open = !open)}
      aria-label={`Toggle Open of "${header}"`}
      role="switch"
      aria-checked={open ? "true" : "false"}
    >
      <Icon name={open ? "collapse_all" : "expand_all"} />
    </button>
  </div>
  {#if open}
    <div class="content" transition:slide={{ duration: 100 }}>
      <slot />
    </div>
  {/if}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
  }

  .toggle {
    background: none;
    border: none;
    box-shadow: none;
    padding: var(--size-1) var(--size-1) var(--size-1) var(--size-3);
  }

  .content {
    interpolate-size: allow-keywords;
    height: auto;
  }
</style>
