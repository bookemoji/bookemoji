<script lang="ts">
  import { type Component } from "svelte";
  import { getMeta } from "$lib/book-emoji.js";
  import Isolate from "./Isolate.svelte";
  import { browser } from "$app/environment";
  import { codeToHtml } from "shiki";
  import { createCopyAction } from "$lib/utils.js";

  interface Props<StoryComponent extends Component = any> {
    /**
     * The component which corresponds to this comp. Used internally to lookup the info described via `defineMeta`
     */
    of: StoryComponent;
    /**
     * The name of the story — which should correspond to &lt;Story&gt;'s `name`
     */
    story: string;
    /**
     * Whether to have the Code block collapsed initially. Because it is dynamically rendered there is a layout shift when the code renders
     * To avoid it, the component is collapsed by default
     */
    collapsed?: boolean;
    shikiOptions?: Parameters<typeof codeToHtml>[1];
    tab?: "  " | "\t";
    /**
     * whether this component is self closing, and thus should not render for children
     */
    selfClosing?: boolean;
    toggler?: import("svelte").Snippet;
    actions?: import("svelte").Snippet;
    content?: string;
  }

  let {
    of,
    story,
    selfClosing = false,
    collapsed = $bindable(true),
    shikiOptions = {
      lang: "svelte",
      theme: "catppuccin-frappe",
    },
    tab = "  ",
    toggler,
    actions,
    content = "...",
  }: Props = $props();

  const meta = getMeta<Component>(of as Component, story);

  let componentName: string = $derived.by(() => {
    if (browser) {
      return $meta.definition.name;
    }

    return "";
  });

  let properties: Record<string, string> = $derived($meta.ready ? ($meta.args ?? {}) : {});
  let startTag = "<" as const;
  let selfClosingEndTag = " />" as const;
  let closingEndTag = ">" as const;

  const asProp = (key: string, value: unknown) => {
    let val: string = "";
    if (value === undefined || value === "") {
      return "";
    }

    if (typeof value === "string") {
      val = `"${value}"`;
    } else {
      val = `{${value}}`;
    }

    return `${key}=${val}`;
  };

  const generateCode = (_props: unknown) => {
    if (Object.keys(properties).length === 0) {
      if (selfClosing) {
        return `${startTag}${componentName} ${selfClosingEndTag}`;
      } else {
        return `${startTag}${componentName}${closingEndTag}${startTag}/${componentName}${closingEndTag}`;
      }
    } else {
      let builder = `${startTag}${componentName}`;

      const total = Object.keys(properties).length;
      Object.entries(properties).forEach(([key, value], i) => {
        const nextProp = asProp(key, value);
        if (nextProp === "") {
          return;
        }

        if (total > 0) {
          builder += "\n";
          builder += tab;
        } else {
          builder += " ";
        }
        // builder += " ";
        builder += nextProp;
      });

      if (selfClosing) {
        builder += selfClosingEndTag;
      } else {
        builder += closingEndTag;
        builder += `\n${tab}${content}\n`;
        builder += `${startTag}/${componentName}${closingEndTag}`; // </Button>
      }

      return builder;
    }
  };

  let code: string = $derived.by(() => generateCode(properties));
  let innerRef: HTMLElement | undefined = $state(undefined);
  let codeAreaHeight: string = $derived.by(() => {
    // This ensures when shiki is re-rendering we don't get a flash of collapsed content
    if (innerRef === undefined) {
      // CASE: if the innerRef is not present, then its the first call
      return "auto";
    } else {
      return `${innerRef.clientHeight}px`;
    }

    return "auto";
  });
  let shikiPromise = $derived.by(() => codeToHtml(code, shikiOptions));

  let { copy, copied } = createCopyAction(() => code, 800);

  function toggle() {
    collapsed = !collapsed;
  }
</script>

{#if browser && $meta.ready}
  <Isolate name={story}>
    {#if collapsed}
      {#if toggler}{@render toggler()}{:else}
        <div class="story-code-toggler">
          <button type="button" onclick={toggle}>&lt;/&gt;</button>
        </div>
      {/if}
    {:else}
      <div class="story-code">
        {#if actions}{@render actions()}{:else}
          <div class="story-code-actions">
            <button class="cmd copy-code" class:copied={$copied} type="button" onclick={copy}>{$copied ? "copied" : "copy"}</button>
            <button class="cmd" type="button" onclick={toggle}>hide</button>
          </div>
        {/if}
        <div class="story-code-wrapper" style:min-height={codeAreaHeight}>
          {#await shikiPromise then codeHTML}
            <div bind:this={innerRef}>
              {@html codeHTML}
            </div>
          {/await}
        </div>
      </div>
    {/if}
  </Isolate>
{/if}
