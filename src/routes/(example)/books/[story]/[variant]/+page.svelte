<script lang="ts">
  import { browser } from "$app/environment";
  import type { PageData } from "./$types.js";
  import Variant from "$lib/components/v4/Variant.svelte";

  export let data: PageData;
</script>

<h3 class="story-name">{data.name} - {data.variant.name}</h3>
{#if data.Book && browser}
  <Variant variant={data.variant}>
    <svelte:component this={data.Book} />
  </Variant>
{/if}
