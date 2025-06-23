<script lang="ts">
  import { page } from "$app/stores";

  const urls: (readonly [page: string, url: string])[] = [
    ["Docs", "/docs"],
    ["Roadmap", "/roadmap"],
    ["Example", "/books"],
  ];
</script>

<header class="header">
  <nav class="nav">
    <ul class="nav-links">
      <li>
        <a class="brand jua-regular" href={`${base}/`}>📚 BookEmoji</a>
      </li>
      {#each urls as [name, url]}
        <li>
          <a class="nav-link" class:active={$page.url.pathname === url} href={`${base}${url}`}
            >{name}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
  <div class="border"></div>
</header>

<style>
  .nav-links {
    list-style: none;
    margin: 0;
    padding: 1rem 1rem;
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem 0.5rem;
  }

  .nav-link.active {
    background-color: var(--surface-2);

    border-radius: 6px;
  }

  .nav-links li {
    padding: 0;
  }

  .brand {
    padding: 1rem 1rem;
  }

  .header {
    margin: 0;
  }

  .border {
    height: 1px;
    background: var(--gradient-26);
  }
</style>
