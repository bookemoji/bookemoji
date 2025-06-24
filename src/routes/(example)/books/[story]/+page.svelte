<script lang="ts">
  import type { PageData } from "./$types.js";

  export let data: PageData;
</script>

<h3 class="story-name">{data.name}</h3>
<svelte:component this={data.Book} />
