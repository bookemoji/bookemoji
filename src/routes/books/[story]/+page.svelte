<script lang="ts">
  import { browser } from "$app/environment";
  import type { PageData } from "./$types.js";

  export let data: PageData;

  console.log("pagedata", data);
</script>

<h3 class="story-name">{data.name}</h3>
{#if data.Book && browser}
  <svelte:component this={data.Book} />
{/if}
