<script lang="ts">
    import { defineMeta } from "$lib/book-emoji.js";
  import Story from "$lib/components/v4/Story.svelte";
  import Select from "./Select.svelte";


  defineMeta({
    component: Select,
  })

</script>

<Story of={Select} name="Basic" args={{ variant: "primary", size: "medium" }} let:args>
  <Select {...args}>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>
</Story>

<Story of={Select} name="Multiple" args={{ multiple: true }} let:args>
  <Select {...args}>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>
</Story>
<Story of={Select} name="Disabled" args={{ disabled: true }} let:args>
  <Select {...args}>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>
</Story>
