<script lang="ts">
  import { getContext, type Component } from "svelte";
  import { getMeta } from "$lib/book-emoji.js";
  import Isolate from "./Isolate.svelte";
  import { browser } from "$app/environment";
  import { codeToHtml } from "shiki";
  import { createCopyAction } from "$lib/utils.js";

  /**
   * The component which corresponds to this comp. Used internally to lookup the info described via `defineMeta`
   */
  export let of: Component;
  /**
   * The name of the story — which should correspond to &lt;Story&gt;'s `name`
   */
  export let story: string;

  /**
   * Whether to have the Code block collapsed initially. Because it is dynamically rendered there is a layout shift when the code renders
   * To avoid it, the component is collapsed by default
   */
  export let collapsed: boolean = true;

  /**
   * whether this component is self closing, and thus should not render for children
   */
  export let selfClosing: boolean = false;

  /**
   * If you want to display children for this component, provide a value here
   * If your component should not have children, set `<StoryCode selfClosing />`
   */
  export let children: string = "...";

  export let shikiOptions: Parameters<typeof codeToHtml>[1] = {
    lang: "svelte",
    theme: "catppuccin-frappe",
  };

  export let tab: "  " | "\t" = "  ";

  const meta = getMeta<Component>(of as Component, story);

  let componentName: string = browser ? $meta.definition.name : "";
  let props: Record<string, string> = $meta.args ?? {};
  let startTag = "<" as const;
  let selfClosingEndTag = " />" as const;
  let closingEndTag = ">" as const;

  $: if ($meta.ready) {
    componentName = $meta.definition.name;
    props = $meta.args;
  }

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
    if (Object.keys(props).length === 0) {
      return `${startTag}${componentName} ${selfClosingEndTag}`;
    } else {
      let builder = `${startTag}${componentName}`;

      const total = Object.keys(props).length;
      Object.entries(props).forEach(([key, value], i) => {
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
        builder += `\n${tab}${children}\n`;
        builder += `${startTag}/${componentName}${closingEndTag}`; // </Button>
      }

      return builder;
    }
  };

  let code = "";
  let codeAreaHeight: string = "auto";
  let innerRef: HTMLElement | undefined = undefined;
  let { copy, copied } = createCopyAction(() => code, 800);

  $: code = generateCode(props);
  $: shikiPromise = rerenderShikiCodeToHTML(code);

  function rerenderShikiCodeToHTML(code: string) {
    // This ensures when shiki is re-rendering we don't get a flash of collapsed content
    if (innerRef === undefined) {
      // CASE: if the innerRef is not present, then its the first call
      codeAreaHeight = "auto";
    } else {
      codeAreaHeight = `${innerRef.clientHeight}px`;
    }
    const promise = codeToHtml(code, shikiOptions);

    return promise;
  }

  function toggle() {
    collapsed = !collapsed;
  }
</script>

{#if browser && $meta.ready}
  <Isolate name={story}>
    {#if collapsed}
      <slot name="toggler">
        <div class="story-code-toggler">
          <button type="button" on:click={toggle}>&lt;/&gt;</button>
        </div>
      </slot>
    {:else}
      <div class="story-code">
        <slot name="actions">
          <div class="story-code-actions">
            <button class="cmd copy-code" class:copied={$copied} type="button" on:click={copy}>{$copied ? "copied" : "copy"}</button>
            <button class="cmd" type="button" on:click={toggle}>hide</button>
          </div>
        </slot>
        <div class="story-code-wrapper" style:min-height={codeAreaHeight}>
          {#await shikiPromise then codeHTML}
            <div bind:this={innerRef}>
              <slot {codeHTML} {code} {codeAreaHeight}>
                {#if code}
                  {@html codeHTML}
                {:else}
                  <p>Could not generate sample code</p>
                {/if}
              </slot>
            </div>
          {/await}
        </div>
      </div>
    {/if}
  </Isolate>
{/if}
