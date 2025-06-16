<script lang="ts">
  import { browser } from "$app/environment";
  import type { PageData } from "./$types.js";

  export let data: PageData;
</script>

<h3 class="story-name">{data.name}</h3>
{#if data.Book}
  <svelte:component this={data.Book} />
{/if}
