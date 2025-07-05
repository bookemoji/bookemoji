<div class="hero">
  <h1 class="brand-font">BookEmoji</h1>
  <h2>a Component Workshop for SvelteKit</h2>
</div>

<div class="side-by-side">
  <div>
    <h3>What is it</h3>
    <p>
      📕 Bookemoji is a component workshop for <a href="https://svelte.dev/docs/kit/introduction#What-is-Svelte" target="_blank">svelte</a> and
      <a href="https://svelte.dev/docs/kit/introduction#What-is-SvelteKit" target="_blank">sveltekit</a> Rethought to suite the needs of a sveltekit application.
    </p>
  </div>

  <div>
    <h3>Vision</h3>
    <aside class="subtitle">initially: vision, later: features</aside>
    <ul class="book-list">
      <li>Tight integration with sveltekit</li>
      <li>Support for Svelte 4.x and 5.x</li>
      <li>unstyled components, style freely 🐎</li>
      <li>No JSX, no obscure errors <br /><i>just svelte and sveltekit.</i></li>
      <li>Low Dependencies</li>
      <li>Very little magic — enough for sorcerers to wield</li>
    </ul>
  </div>
</div>

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

  .hero :where(h1) {
    font-size: var(--font-size-fluid-3);
  }

  .hero :where(h2) {
    font-size: var(--font-size-fluid-2);
  }

  .side-by-side {
    margin: 2rem 0;
    padding-bottom: 20vh;
  }

  .subtitle {
    margin-top: -2.5em;
    font-style: italic;
    font-size: 1rem;
    color: var(--gray-6);
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 60rem) {
    .side-by-side {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }

  .book-list {
    padding: 0 0 0 1rem;
  }

  .book-list li:nth-of-type(4n) {
    list-style-type: "📕";
  }
  .book-list li:nth-of-type(4n - 1) {
    list-style-type: "📗";
  }
  .book-list li:nth-of-type(4n - 2) {
    list-style-type: "📘";
  }
  .book-list li:nth-of-type(4n - 3) {
    list-style-type: "📙";
  }
  .book-list li:nth-of-type(5n) {
    list-style-type: "📔";
  }
</style>
