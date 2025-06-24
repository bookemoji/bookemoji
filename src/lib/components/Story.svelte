<script lang="ts">
  import Isolate from "./Isolate.svelte";
  import { getMeta, nameToId, type ArgTypeControl } from "$lib/book-emoji.js";
  import { getContext, onMount, type Component } from "svelte";

  interface Props {
    name: string;
    of: Component;
    args?: Record<string, any>;
    children?: import("svelte").Snippet<[any]>;
  }

  let { name, of, args = {}, children }: Props = $props();

  let id = nameToId(name);

  const meta = getMeta<typeof of>(of, name);

  // apply args initially
  onMount(() => {
    $meta.args = args;
  });

  let finalArgs = $derived({
    ...$meta.args,
    ...args,
  });
</script>

<Isolate {name}>
  {@const SvelteComponent = of}
  <div class="story-root" {id} data-story={id}>
    <h5 class="story-name">{name}</h5>
    <div class="story" data-name={name}>
      {#if children}{@render children({ args: finalArgs })}{:else}
        <SvelteComponent {...finalArgs} />
      {/if}
    </div>
  </div>
</Isolate>
