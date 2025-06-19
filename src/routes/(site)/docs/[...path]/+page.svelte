<script lang="ts">
  import type { PageData } from "./$types.js";

  export let data: PageData;
</script>

<div class="mdx-content">
  {@html data.content}
</div>

<style>
</style>
