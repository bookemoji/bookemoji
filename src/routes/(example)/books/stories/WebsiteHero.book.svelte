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
      size: { type: "text" },
    },
  });
</script>

<Story name="Basic" of={Hero} class={"minimal"} let:args>
  <div style:position="relative">
    <Hero {...args} />
  </div>
</Story>

<Controls story="Basic" of={Hero} />
