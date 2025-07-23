<script lang="ts">
  import Button from "./Button.svelte";
  import Story from "$lib/components/v4/Story.svelte";
  import Controls from "$lib/components/v4/Controls.svelte";
  import StoryCode from "$lib/components/v4/StoryCode.svelte";
  import { defineMeta } from "$lib/book-emoji.js";

  defineMeta<typeof Button>({
    component: Button,

    argTypes: {
      variant: { type: "select", options: ["primary", "secondary", "tertiary"] },
      size: { type: "select", options: ["small", "medium", "large"] },
      disabled: { type: "boolean" },
      loading: { type: "boolean" },
      class: { type: "text" },
      type: { type: "select", options: ["button", "submit", "reset"] },
      ariaLabel: { type: "text" },
      text: { type: "text" },
    },
    args: {
      type: "button",
      class: "test test-test",
    },
  });
</script>

<Story of={Button} name="Basic" args={{ variant: "primary", size: "medium", text: "Primary Button" }} />
<StoryCode of={Button} story={"Basic"} />
<Controls of={Button} story="Basic" />

<Story of={Button} name="Secondary" args={{ variant: "secondary", size: "medium", text: "Secondary Button" }} />
<StoryCode of={Button} story={"Secondary"} />
<Controls of={Button} story="Secondary" />

<Story of={Button} name="Tertiary" args={{ variant: "tertiary", size: "medium", text: "Tertiary Button" }} />
<StoryCode of={Button} story="Tertiary" />
<Controls of={Button} story="Tertiary" />
