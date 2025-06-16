<script lang="ts">
  import Story from "$lib/components/v4/Story.svelte";
  import Button from "./Button.svelte";
</script>

<!-- controls can override args -->
<Story of={Button} name="Basic" args={{ variant: "primary", size: "medium" }} let:args>
  <Button {...args}>Primary Button</Button>
</Story>

<Story
  of={Button}
  name="Secondary"
  args={{ variant: "secondary", size: "medium", text: "Secondary Button" }}
/>
<Story
  of={Button}
  name="Tertiary"
  args={{ variant: "tertiary", size: "medium", text: "Tertiary Button" }}
/>
