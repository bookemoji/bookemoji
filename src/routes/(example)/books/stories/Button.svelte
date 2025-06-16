<script lang="ts">
  export let variant: "primary" | "secondary" | "tertiary" = "primary";
  export let size: "small" | "medium" | "large" = "medium";
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let classes: string = "";
  export let type: "button" | "submit" | "reset" = "button";
  export let ariaLabel: string = "";
  export let text: string = "";

  $: _class = `${variant} ${size} ${loading ? "loading" : ""} ${classes}`;
</script>

<button {type} aria-label={ariaLabel} {disabled} class={_class}>
  <slot>{text}</slot>
</button>
