<script lang="ts">
  import type { PageData } from "./$types.js";
  import Variant from "$lib/components/v4/Variant.svelte";

  export let data: PageData;
</script>

<h3 class="story-name">{data.name} - {data.variant.name}</h3>

<Variant variant={data.variant}>
  <svelte:component this={data.Book} />
</Variant>
