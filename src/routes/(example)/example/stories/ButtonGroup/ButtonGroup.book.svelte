<script lang="ts" context="module">
  import type { BookMeta } from "bookemoji";
  export const metadata = {
    group: "A Group",
  } satisfies BookMeta;
</script>

<script lang="ts">
  import Story from "$lib/components/v4/Story.svelte";
  import Controls from "$lib/components/v4/Controls.svelte";
  import ButtonGroup from "./ButtonGroup.svelte";
  import { defineMeta } from "$lib/book-emoji.js";

  defineMeta<typeof ButtonGroup>({
    component: ButtonGroup,

    argTypes: {
      variant: { type: "select", options: ["primary", "secondary", "tertiary"] },
      size: { type: "select", options: ["small", "medium", "large"] },
      disabled: { type: "boolean" },
      loading: { type: "boolean" },
      classes: { type: "text" },
      type: { type: "select", options: ["button", "submit", "reset"] },
      ariaLabel: { type: "text" },
      text: { type: "text" },
    },
  });
</script>

<Story of={ButtonGroup} name="Basic" args={{ variant: "primary", size: "medium", text: "Primary Button" }} />

<Controls of={ButtonGroup} story="Basic" />

<Story of={ButtonGroup} name="Secondary" args={{ variant: "secondary", size: "medium", text: "Secondary Button" }} />
<Controls of={ButtonGroup} story="Secondary" />

<Story of={ButtonGroup} name="Tertiary" args={{ variant: "tertiary", size: "medium", text: "Tertiary Button" }} />

<Controls of={ButtonGroup} story="Tertiary" />
