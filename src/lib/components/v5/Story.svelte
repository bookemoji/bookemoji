<script lang="ts" generics="T extends Component<any>">
  import Isolate from "./Isolate.svelte";
  import { getMeta, nameToId } from "$lib/book-emoji.js";
  import { onMount, type Component, type ComponentProps, type Snippet } from "svelte";

  interface Props<Comp extends Component, CompProps extends ComponentProps<Comp> = any> {
    name: string;
    of: Comp;
    args?: Omit<CompProps, "children" | "$$props" | "$$events" | "$$slots" | "$$rest">;
    children?: Snippet<[any]>;
  }

  let { name, of, args = {}, children }: Props<T> = $props();

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
  <div class="story-root" {id} data-story={name}>
    <h5 class="story-name">{name}</h5>
    <div class="story" data-name={name}>
      {#if children}{@render children({ args: finalArgs })}{:else}
        <SvelteComponent {...finalArgs} />
      {/if}
    </div>
  </div>
</Isolate>
