<script lang="ts">
  import Story from "$lib/components/v5/Story.svelte";
  import Controls from "$lib/components/v5/Controls.svelte";
  import Test from "./Test.svelte";
  import { defineMeta } from "$lib/book-emoji.js";
  import StoryCode from "$lib/components/v5/StoryCode.svelte";

  defineMeta<typeof Test>({
    component: Test,

    argTypes: {
      text: { type: "text" },
    },
  });
</script>

<p>This component is in Runes Mode.</p>

<Story of={Test} name="Basic" args={{ text: "Test Town" }} />
<StoryCode of={Test} story="Basic" content={`<p>Hello world</p>`}></StoryCode>
<Story of={Test} name="It Renders" args={{ text: "blee blee blah" }} />
<StoryCode of={Test} story="It Renders" content={`<p>Hello world</p>`}></StoryCode>
