<script lang="ts">
  import { defineMeta } from "$lib/book-emoji.js";
  import Controls from "$lib/components/v4/Controls.svelte";
  import Story from "$lib/components/v4/Story.svelte";
  import Select from "./Select.svelte";

  const options = ["Option 1", "Option 2", "Option 3"];

  defineMeta({
    component: Select,
    argTypes: {
      value: { type: "select", options },
      multiple: { type: "boolean", disabled: true },
      disabled: { type: "boolean" },
    },
    args: {
      value: "",
    },
  });
</script>

<Story of={Select} name="Basic" let:args>
  <Select {...args}>
    <option disabled selected value={""}>Select an Option</option>
    <option value="Option 1">Option 1</option>
    <option value="Option 2">Option 2</option>
    <option value="Option 3">Option 3</option>
  </Select>
</Story>
<Controls of={Select} story="Basic" />

<Story of={Select} name="Disabled" args={{ disabled: true }} let:args>
  <Select {...args}>
    <option disabled selected value={""}>Select an Option</option>
    <option value="Option 1">Option 1</option>
    <option value="Option 2">Option 2</option>
    <option value="Option 3">Option 3</option>
  </Select>
</Story>
<Controls of={Select} story="Disabled" />

<Story of={Select} name="Multiple" args={{ multiple: true, value: [] }} let:args>
  <Select {...args}>
    <option disabled selected value={""}>Select an Option</option>
    <option value="Option 1">Option 1</option>
    <option value="Option 2">Option 2</option>
    <option value="Option 3">Option 3</option>
  </Select>
</Story>
<Controls of={Select} story="Multiple" argTypes={{ value: { type: "multiselect", options } }} />
