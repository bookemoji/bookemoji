<div class="hero">
  <h1 class="jua-regular">BookEmoji</h1>
  <h2>a SvelteKit Component Library</h2>
</div>

<p>
  📕 Bookemoji is a component library for svelte. Rethought to suite the needs of a sveltekit
  application.
</p>

<h3>Vision</h3>
<ul>
  <li>It integrates tightly with your sveltekit app. — deploys with your application</li>
  <li>It is a set of unstyled components, yours to own and style freely</li>
  <li>No JSX, no obscure errors, just straight svelte and sveltekit.</li>
  <li>Low Dependencies</li>
  <li>Very little magic—just enough for some sorcerers to wield if astute to learn</li>
</ul>

<style>
  .hero {
    height: calc(90vh - 2rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: calc(2rem + 10vw);
    margin-bottom: 2rem;
  }

  .hero :where(h1, h2) {
    margin: 0;
  }
</style>
