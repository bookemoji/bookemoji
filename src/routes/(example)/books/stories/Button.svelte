<script lang="ts">
  export let variant: "primary" | "secondary" | "tertiary" = "primary";
  export let size: "small" | "medium" | "large" = "medium";
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let classes: string = "";
  export let type: "button" | "submit" | "reset" = "button";
  export let ariaLabel: string = "";
  export let text: string = "";

  $: _class = `btn ${variant} ${size} ${loading ? "loading" : ""} ${disabled ? "disabled" : ""} ${classes}`;
</script>

<button {type} aria-label={ariaLabel} {disabled} class={_class}>
  <slot>{loading ? "Loading..." : text}</slot>
</button>

<style>
  .btn {
    border: 1px solid transparent;
    cursor: pointer;
    transition: opacity 0.2s;
    font-size: 1rem;
    border-radius: 4px;
    outline: none;
    color: #202;
    font-weight: 400;
    text-shadow: none;
  }

  /* Size styles */
  .small {
    padding: 0.15rem 0.75rem;
    font-size: 0.85rem;
  }
  .medium {
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
  }
  .large {
    padding: 0.75rem 2.5rem;
    font-size: 1.15rem;
  }

  /* Variant styles */
  .primary {
    background: #aad;
    color: #000;
  }
  .secondary {
    background: #77a;
    color: #fff;
  }
  .tertiary {
    background: #7aa;
    color: #fff;
  }

  /* Disabled styles */
  .btn.disabled,
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Loading styles */
  .loading {
    position: relative;
    opacity: 0.7;
    pointer-events: none;
  }
</style>
