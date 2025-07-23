<script lang="ts">
  import Isolate from "./Isolate.svelte";
  import { getMeta, nameToId } from "$lib/book-emoji.js";
  import { onMount, type SvelteComponent, type ComponentType } from "svelte";
  import { browser } from "$app/environment";

  export let name: string;
  export let of: ComponentType<SvelteComponent<any, any, any>>;
  export let args: Record<string, any> = {};
  let classNames: string = "";

  export { classNames as class };

  let id = nameToId(name);

  const meta = getMeta<typeof of>(of, name);

  let finalArgs = {};

  if (browser) {
    $meta.initialArgs = { ...$meta.args, ...args };
    if (Object.keys(args).length > 0) {
      $meta.args = args;
    }
    $meta.ready = true;
  }

  $: if (browser) {
    finalArgs = {
      ...$meta.initialArgs,
      ...$meta.args,
      ...args,
    };
  }

  // i'm not sure why or if this code needs to be within onMount
  onMount(() => {
    // CASE: IF we have defined `args` on our story, we want to apply them to our meta
    //       otherwise, we defer to the defaults from our defineMeta

    return () => {
      $meta.ready = false;
    };
  });
</script>

<Isolate {name}>
  {#key $meta.key}
    <div class={`story-root ${classNames}`} {id} data-story={name}>
      <h5 class="story-name">{name}</h5>
      <div class="story" data-name={name}>
        <slot args={finalArgs}>
          <svelte:component this={of} {...finalArgs} />
        </slot>
      </div>
    </div>
  {/key}
</Isolate>
