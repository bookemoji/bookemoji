<script lang="ts">
  import Isolate from "./Isolate.svelte";
  import { getMeta, nameToId } from "$lib/book-emoji.js";
  import { onMount, type SvelteComponent, type ComponentType } from "svelte";

  export let name: string;
  export let of: ComponentType<SvelteComponent<any, any, any>>;
  export let args: Record<string, any> = {};

  let id = nameToId(name);

  const meta = getMeta<typeof of>(of, name);

  // apply args initially
  onMount(() => {
    $meta.args = args;
  });

  $: finalArgs = {
    ...$meta.args,
    ...args,
  };
</script>

<Isolate {name}>
  <div class="story-root" {id} data-story={name}>
    <h5 class="story-name">{name}</h5>
    <div class="story" data-name={name}>
      <slot args={finalArgs}>
        <svelte:component this={of} {...finalArgs} />
      </slot>
    </div>
  </div>
</Isolate>
