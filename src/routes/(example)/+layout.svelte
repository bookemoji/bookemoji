<script>
  import { base } from "$app/paths";
</script>

<div class="back-ribbon">
  <a href={`${base}/`}>Go Back</a>
</div>

<slot />

<style>
  .back-ribbon {
    padding: 0.5rem 2rem;
    border-bottom: 1px solid var(--surface-2);
  }
</style>
