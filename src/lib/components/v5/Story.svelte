<script lang="ts">
  import Isolate from "./Isolate.svelte";
  import { getMeta, nameToId } from "$lib/book-emoji.js";
  import { onMount, type Component, type ComponentProps } from "svelte";
  import { browser } from "$app/environment";

  interface Props<StoryComponent extends Component = any> {
    name: string;
    of: StoryComponent;
    args?: ComponentProps<StoryComponent>;
    class?: string;
    children?: import("svelte").Snippet<[any]>;
  }

  let { name, of, args = {}, class: classNames = "", children }: Props = $props();

  let id = nameToId(name);

  const meta = getMeta<typeof of>(of, name);

  let finalArgs = $state({});

  if (browser) {
    $meta.initialArgs = { ...$meta.args, ...args };
    if (Object.keys(args).length > 0) {
      $meta.args = args;
    }
    $meta.ready = true;
  }

  $effect(() => {
    if (browser) {
      finalArgs = {
        ...$meta.initialArgs,
        ...$meta.args,
        ...args,
      };
    }
  });

  onMount(() => {
    // CASE: IF we have defined `args` on our story, we want to apply them to our meta
    //       otherwise, we defer to the defaults from our defineMeta

    return () => {
      $meta.ready = false;
    };
  });
</script>

<Isolate {name}>
  {@const SvelteComponent_1 = of}
  {#key $meta.key}
    <div class={`story-root ${classNames}`} {id} data-story={name}>
      <h5 class="story-name">{name}</h5>
      <div class="story" data-name={name}>
        {#if children}{@render children({ args: finalArgs })}{:else}
          <SvelteComponent_1 {...finalArgs} />
        {/if}
      </div>
    </div>
  {/key}
</Isolate>
