<script lang="ts">
  import { page } from "$app/stores";
</script>

{#if $page.url.pathname.startsWith("/books")}
  <div class="page-footer">
    <p><a href="https://thenounproject.com/icon/sparkle-star-7309925/" target="_blank">Sparkle icon Created by Spacenobyl from Noun Project</a></p>
  </div>
{/if}
<footer class="footer">
  <div class="brand-font">Built with 😻</div>
  <div class="link-list">
    <a href="https://app.rybbit.io/1526/main" target="_blank">Public Analytics</a>
    <div><a href="https://github.com/bookemoji/bookemoji" target="_blank">Github</a> / <a href="https://github.com/bookemoji" target="_blank">Org</a></div>
  </div>
</footer>

<style>
  .footer,
  .page-footer {
    display: flex;
    border-top: 1px solid var(--surface-2);
    padding: 1rem;
    align-items: center;
  }

  .footer {
    display: flex;
    gap: 1rem;
    justify-content: space-evenly;
    padding: 2rem 1rem;
  }

  .page-footer {
    justify-content: center;
    --link: var(--stone-8);
  }
  .link-list {
    display: grid;
  }
</style>
