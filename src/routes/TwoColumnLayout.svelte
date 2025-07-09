<div class="two-cols">
  <div class="content-pane">
    <slot />
  </div>
  <div class="sidebar-pane">
    <slot name="sidebar" />
  </div>
</div>

<style>
  .two-cols {
    border-top: 1px solid var(--surface-2);
    display: grid;
  }

  .content-pane {
    padding: 1rem;
    order: 2;
  }

  .sidebar-pane {
    padding: 1rem;
    border-bottom: 1px solid var(--surface-2);
  }

  @media screen and (min-width: 48rem) {
    .two-cols {
      display: grid;
      gap: 2rem;
      grid-template-columns: 14rem auto;
    }

    .sidebar-pane {
      padding-top: calc(var(--font-lineheight-4) * var(--font-size-8));
      border-bottom: none;
      border-right: 1px solid var(--surface-2);
      height: 100%;
      min-height: 100vh;
    }
  }

  :global(.sidebar-pane :where(h1, h2, h3, h4, h5)) {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
  }
</style>
