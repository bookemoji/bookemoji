<script lang="ts">
  import { run } from "svelte/legacy";

  import { type Component } from "svelte";
  import { getMeta } from "$lib/book-emoji.js";
  import Isolate from "./Isolate.svelte";
  import { browser } from "$app/environment";
  import { codeToHtml } from "shiki";
  import { createCopyAction } from "$lib/utils.js";

  interface Props {
    /**
     * The component which corresponds to this comp. Used internally to lookup the info described via `defineMeta`
     */
    of: Component;
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
    toggler?: import("svelte").Snippet;
    actions?: import("svelte").Snippet;
    children?: import("svelte").Snippet<[any]>;
  }

  let {
    of,
    story,
    collapsed = $bindable(true),
    shikiOptions = {
      lang: "svelte",
      theme: "catppuccin-frappe",
    },
    tab = "  ",
    toggler,
    actions,
    children,
  }: Props = $props();

  const meta = getMeta<Component>(of as Component, story);

  let componentName: string = $state(browser ? $meta.definition.name : "");
  let properties: Record<string, string> = $state($meta.args ?? {});
  let startTag = "<";
  let endTag = " />";

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
      return `${startTag}${componentName} ${endTag}`;
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
      builder += endTag;

      return builder;
    }
  };

  let code = $state("");
  let codeAreaHeight: string = $state("auto");
  let innerRef: HTMLElement | undefined = $state(undefined);
  let { copy, copied } = createCopyAction(() => code, 800);

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
  run(() => {
    if ($meta.ready) {
      componentName = $meta.definition.name;
      properties = $meta.args;
    }
  });
  run(() => {
    code = generateCode(properties);
  });
  let shikiPromise = $derived(rerenderShikiCodeToHTML(code));
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
              {#if children}{@render children({ codeHTML, code, codeAreaHeight })}{:else if code}
                {@html codeHTML}
              {:else}
                <p>Could not generate sample code</p>
              {/if}
            </div>
          {/await}
        </div>
      </div>
    {/if}
  </Isolate>
{/if}
