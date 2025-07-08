<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";

  const urls: (readonly [page: string, url: string])[] = [
    ["Docs", "/docs"],
    ["Roadmap", "/roadmap"],
    ["Blog", "/blog"],
    ["Example", "/books"],
  ];
</script>

<header class="header" class:sticky={$page.route.id === "/"}>
  <nav class="nav">
    <a class="brand brand-font" href={`/`}>📚 BookEmoji</a>
    <ul class="nav-links">
      {#each urls as [name, url]}
        <li>
          <a class="nav-link" class:active={$page.url.pathname === url} href={`${url}`}>{name}</a>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style>
  .nav {
    gap: 2rem;
  }
  .nav-links {
    list-style: none;
    display: flex;
    margin: 0;
    gap: 1rem;
    padding: 1rem 1rem;
    margin-left: auto;
    justify-content: center;
    align-items: center;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
  }

  .nav-link.active {
    border: 1px solid var(--surface-2);
    border-radius: 6px;
  }

  .nav-links li {
    padding: 0;
  }

  .brand {
    display: flex;
    padding: 2rem 2rem;
    align-items: center;
    justify-content: center;
  }

  .header {
    padding: 0rem 0;
    margin: 0;
  }

  @media screen and (min-width: 48rem) {
    .brand {
      padding: 1rem;
      justify-content: start;
    }
    .nav {
      display: flex;
    }

    .sticky {
      position: sticky;
      top: 0;
      background: linear-gradient(to bottom, rgba(20, 30, 40, 0.1) 85%, transparent);
      backdrop-filter: saturate(0.7);
    }
  }
</style>
