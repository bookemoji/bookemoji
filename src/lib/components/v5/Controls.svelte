<script lang="ts" generics="Comp extends SvelteComponent | Component<any, any>">
  import { run, preventDefault } from "svelte/legacy";

  import { getMeta, type ArgTypeControl, type InferArgTypes, type MetaOptions, type NumberControl } from "$lib/book-emoji.js";
  import { onMount, tick, type Component, type ComponentType, type SvelteComponent } from "svelte";
  import Isolate from "./Isolate.svelte";
  import type { FormEventHandler } from "svelte/elements";
  import { replaceState } from "$app/navigation";
  import { browser, dev } from "$app/environment";

  interface Props {
    /**
     * The component which corresponds to the controls. Used internally to lookup the info described via `defineMeta`
     */
    of: Comp;
    /**
     * The name of the story — which should correspond to &lt;Story&gt;'s `name`
     */
    story: string;
    /**
     * Whether to display a "reload" button within the controls, which can be used to dismount then remount the component
     */
    reloadable?: boolean;
    /**
     * Whether to display a "reset" button within the controls
     */
    resetable?: boolean;
    /**
     * Whether changes to the Controls should set query params corresponding to the value
     */
    syncToUrl?: boolean;
    /**
     * An override for the `defineMeta` argTypes. Generally only needed if your component is isomorphic or generic
     *
     */
    argTypes?: Partial<InferArgTypes<Comp>> | undefined;
    /**
     * Whether to JSON-print the details about the component's bookemoji state.
     * Only available when running `npm run dev` / `vite dev`
     */
    debug?: boolean;
  }

  let { of, story, reloadable = true, resetable = true, syncToUrl = true, argTypes = undefined, debug = false }: Props = $props();

  const meta = getMeta<Component>(of as Component, story);

  let formRef: HTMLFormElement | undefined = $state(undefined);
  let hasChanged: boolean = $state(false);
  let initialValue: Record<string, any> | undefined = $state(undefined);
  let errors: Error[] = $state([]);
  let isIsolated: boolean = $state(false);

  function calcHasChanged(canCompare: boolean, initialArgs: typeof initialValue, args: typeof $meta.args) {
    if (canCompare && initialArgs !== undefined) {
      for (let key in args) {
        if (initialArgs[key] !== args[key]) {
          return true;
        }
      }

      return false;
    }

    return false;
  }

  function onReload() {
    $meta.key = `${Date.now()}`;
  }

  // per svelte docs: use reset sparingly — so we will instead reset based on data instead of form reset
  function onReset() {
    // todo: build url so we can clear this "?"
    replaceState("?", {});
    // if a prop's type is different than the defineMeta, it will breakity break here
    let nextArgs: Record<string, any> = { ...initialValue };

    // if argTypes exist we know we have some overrides;
    const metaArgTypes = $meta.argTypes ?? {};
    if (argTypes !== undefined) {
      for (let key in nextArgs) {
        if (metaArgTypes[key]?.type === argTypes[key]?.type) {
          continue;
        }
      }
    }

    $meta.args = { ...$meta.args, ...nextArgs };
  }

  // svelte 5.6+ has bind:value={get, set} pattern for this to be unnessecary
  function createNumberInputHandler(key: string, control: NumberControl): FormEventHandler<HTMLInputElement> {
    return (event) => {
      if (control.required && event.currentTarget?.value === null) {
        event.currentTarget.value = `${control.min ?? 0}`;
      } else {
        // ensure a valid number shape
        const shape = parseInt(event.currentTarget.value, 10);
        if (!isNaN(shape)) {
          event.currentTarget.value = `${shape}`;
        } else {
          event.currentTarget.value = `${control.min ?? 0}`;
        }
      }
    };
  }

  const onFieldChange: FormEventHandler<HTMLFieldSetElement> = (e) => {
    if (isIsolated && syncToUrl && initialValue !== undefined) {
      let search = new URLSearchParams("");

      const args = $meta.args;

      for (let key in args) {
        const value = args[key];

        const hasInitialValue = key in initialValue;
        if (!hasInitialValue) {
          // CASE: don't include falsy values that are not in our initialValues
          if (value) {
            search.set(key, `${value}`);
          }
        } else if (value !== initialValue[key]) {
          if (Array.isArray(value)) {
            value.filter((v) => !(v === "" || v === undefined || v === null)).forEach((v) => search.append(`${key}`, `${v}`));
          } else if (value !== undefined && value !== "" && value !== null) {
            search.set(key, `${value}`);
          }
        }
      }

      const searchString = `?${search.toString()}`;

      replaceState(searchString, {
        // ...args,
      });
    }
  };

  const onSubmit = (event: Event) => {};

  /**
   * things that would be within onMount if the required structures and data were ready at that time
   */
  async function onReady() {
    // CASE: Enforce argTypes and args
    // in the case that the user provides argTypes, we require them to provide a matching `args` as well
    if (argTypes !== undefined) {
      for (let key in argTypes) {
        if (typeof $meta.args[key] === "undefined") {
          errors = [
            ...errors,
            new Error(`<Control story="${story}"> has an argType override for "${key}", but the <Story name="${story}"> does not have an arg.`),
          ];
        }
      }
    }

    // FEAT: set initialValue _after_ the component is ready
    initialValue = { ...$meta.initialArgs, ...$meta.args };

    await tick();

    // FEAT: Set control args based on url params
    if (browser && isIsolated) {
      const search = new URLSearchParams(window.location.search);

      if (search.size > 0) {
        Array.from(search.entries()).forEach(([key, value]) => {
          const _argTypes = { ...$meta.argTypes, ...argTypes };
          if (_argTypes[key]) {
            const type = _argTypes[key].type;

            if (type === "text") {
              $meta.args[key] = value;
            } else if (type === "boolean") {
              $meta.args[key] = value === "true";
            } else if (type === "number") {
              $meta.args[key] = value.includes(".") ? parseFloat(value) : parseInt(value, 10);
            } else if (type === "select") {
              $meta.args[key] = value;
            } else if (type === "multiselect") {
              const values = search.getAll(key);
              $meta.args[key] = values;
            } else {
              const _exhausted: never = type;
            }
          }
        });
      }
    }
  }

  function onSelectInput(key: string, target: HTMLSelectElement) {
    $meta.args[key] = target.value;
  }

  function onInputInput(key: string, target: HTMLInputElement) {
    $meta.args[key] = target.checked;
  }
  let argTypeEntries = $derived(Object.entries({ ...$meta.argTypes, ...argTypes }).filter((kvp): kvp is [string, ArgTypeControl] => kvp[1] !== undefined));
  run(() => {
    if ($meta.ready && initialValue === undefined) {
      onReady();
    }
  });
  run(() => {
    hasChanged = calcHasChanged(initialValue !== undefined, initialValue, $meta.args);
  });
</script>

{#if errors.length > 0}
  <div class="errors">
    {#each errors as error}
      {error.name} — {error.message}
    {/each}
  </div>
{/if}

{#if $meta.ready}
  <Isolate bind:isIsolated name={story}>
    <form class="controls-root" onsubmit={preventDefault(onSubmit)} bind:this={formRef}>
      <fieldset class="controls" onchange={onFieldChange}>
        <legend class="controls-title">Controls</legend>

        {#each argTypeEntries as [key, control]}
          {@const id = `${story}-${key}`}
          <div class="form-group">
            <label class="control" class:disabled={"disabled" in control ? (control.disabled ?? false) : false}>
              <span>{key}</span>
              {#if control.type === "select"}
                <select
                  {id}
                  value={$meta.args[key]}
                  oninput={(e) => {
                    onSelectInput(key, e.currentTarget);
                  }}
                >
                  <option value="" selected>Not Set</option>
                  {#each control.options as option}
                    <option value={option}>{option}</option>
                  {:else}
                    <option disabled selected>No options</option>
                  {/each}
                </select>
              {:else if control.type === "multiselect"}
                <select multiple {id} value={$meta.args[key]} oninput={(e) => onSelectInput(key, e.currentTarget)}>
                  <option value="" selected>Not Set</option>
                  {#each control.options as option}
                    <option value={option}>{option}</option>
                  {:else}
                    <option disabled selected>No options</option>
                  {/each}
                </select>
              {:else if control.type === "text"}
                <input {id} type="text" bind:value={$meta.args[key]} />
              {:else if control.type === "boolean"}
                <input
                  {id}
                  disabled={control.disabled}
                  type="checkbox"
                  bind:checked={$meta.args[key]}
                  class:disabled={control.disabled}
                  oninput={(e) => onInputInput(key, e.currentTarget)}
                />
              {:else if control.type === "number"}
                <input {id} {...control} bind:value={$meta.args[key]} oninput={createNumberInputHandler(key, control)} />
              {/if}
            </label>
          </div>
        {/each}
        <div class="actions">
          {#if reloadable}
            <button type="button" onclick={onReload}> rerender </button>
          {/if}

          {#if resetable}
            <button disabled={initialValue === undefined || !hasChanged} type="button" onclick={onReset}> reset </button>
          {/if}
        </div>
      </fieldset>
    </form>

    {#if debug && dev}
      <div class="debug">
        <h5>meta</h5>
        <pre><code>{JSON.stringify($meta, null, 2)}</code></pre>
        <h5>argTypes</h5>
        <pre><code>{JSON.stringify(argTypes, null, 2)}</code></pre>
      </div>
    {/if}
  </Isolate>
{/if}

<style>
  .disabled,
  label.disabled span {
    opacity: 0.5;
    cursor: default;
  }
</style>
