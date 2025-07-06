<script lang="ts">
  import Story from "$lib/components/v5/Story.svelte";
  import Controls from "$lib/components/v5/Controls.svelte";
  import Test from "./Test.svelte";
  import { defineMeta } from "$lib/book-emoji.js";

  defineMeta<typeof Test>({
    component: Test,

    argTypes: {
      text: { type: "text" },
    },
  });
</script>

<Story of={Test} name="Basic" args={{ text: "Test Town" }} />
<Story of={Test} name="It Renders" args={{ text: "blee blee blah" }} />
