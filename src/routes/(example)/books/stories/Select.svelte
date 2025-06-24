<script lang="ts">
  export let value: string | null = null;
  export let multiple: boolean = false;
  export let disabled: boolean = false;
</script>

{#if multiple}
  <select bind:value multiple {disabled} class="select">
    <slot />
  </select>
{:else}
  <select bind:value {disabled} class="select">
    <slot />
  </select>
{/if}

<style>
  .select {
    min-width: 8em;
  }
</style>
