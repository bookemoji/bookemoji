<script>
  import { base } from "$app/paths";
</script>

<header class="header">
  <nav class="nav">
    <ul class="nav-links">
      <li>
        <a class="brand jua-regular" href={`${base}/`}>📚 BookEmoji</a>
      </li>
      <li>
        <a href={`${base}/docs`}>Docs</a>
      </li>
      <li>
        <a href={`${base}/roadmap`}>Roadmap</a>
      </li>
      <li>
        <a href={`${base}/books`}>Example</a>
      </li>
    </ul>
  </nav>
  <div class="border"></div>
</header>

<style>
  .nav-links {
    list-style: none;
    margin: 0;
    padding: 1rem;
    display: flex;
    gap: var(--size-4, 1rem);
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
