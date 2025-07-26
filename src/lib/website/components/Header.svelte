<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import GithubLogo from "../icons/GithubLogo.svelte";

  const urls: (readonly [page: string, url: string])[] = [
    ["Docs", "/docs"],
    ["Roadmap", "/roadmap"],
    ["Blog", "/blog"],
    ["Example", "/books"],
  ];
</script>

<header class="header" class:sticky={$page.route.id === "/"}>
  <nav class="nav">
    <a class="brand brand-font brand-color" href={`/`}>📚 BookEmoji</a>
    <ul class="nav-links">
      {#each urls as [name, url]}
        <li>
          <a class="nav-link" class:active={$page.url.pathname === url} href={`${url}`}>{name}</a>
        </li>
      {/each}
      <li>
        <a
          class="nav-link nav-link--icon"
          href="https://github.com/bookemoji/bookemoji"
          target="_blank"
          aria-label="Github"
          data-rybbit-event="clicked_github_in_nav"
        >
          <span class="visually-hidden">Github</span>
          <GithubLogo />
        </a>
      </li>
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
    flex-wrap: wrap;
    margin: 0;
    gap: 1rem;
    padding: 1rem 1rem;
    margin-left: auto;
    justify-content: center;
    align-items: center;
  }

  .nav-link.nav-link--icon {
    padding: 0;
    border: none;
  }

  .nav-link {
    color: var(--nav-link-color);
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
    font-size: 1.5em;
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
      z-index: 1;

      backdrop-filter: saturate(0.7);
    }

    @media (prefers-color-scheme: dark) {
      .sticky {
        background: linear-gradient(to bottom, rgba(20, 30, 40, 0.1) 5%, transparent);
      }
    }

    @media (prefers-color-scheme: light) {
      .sticky {
        background: linear-gradient(to bottom, rgba(240, 250, 255, 0.8) 5%, transparent);
      }
    }
  }
</style>
