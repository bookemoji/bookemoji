<script lang="ts">
  import Hero from "$lib/website/components/Hero.svelte";
  import { defineMeta } from "$lib/book-emoji.js";
  import Story from "$lib/components/v4/Story.svelte";
  import Controls from "$lib/components/v4/Controls.svelte";

  defineMeta<typeof Hero>({
    component: Hero,
    args: {
      size: 20,
    },
    argTypes: {
      size: { type: "number", min: 0, max: 1000, step: 10, required: true },
    },
  });
</script>

<Story name="Basic" of={Hero} class={"minimal"} let:args>
  <div style:position="relative">
    <Hero {...args}>
      <h1>Hero</h1>
      <p>This is the "Hero" component used on the landing page of <a href="/">bookemoji.dev</a></p>
      <p>It showcases emergent effects of a few systems</p>
      <p>Moving your mouse will "draw" a some particle-like squares near the mouse location.</p>
      <p>On-render it will create bezier-curve paths across the screen. Re-rendering will redraw the curves. Give it a try!</p>
    </Hero>
  </div>
</Story>

<Controls story="Basic" of={Hero} />
