import { get, readonly, writable, type Writable } from "svelte/store";
import { wait } from "./website/renderer-utils.js";

export type KeyKeyMap<Key1, Key2, Value> = {
  set: (key1: Key1, key2: Key2, value: Value) => void;
  get: (key1: Key1, key2: Key2) => Value | undefined;
};

export const createKeyKeyMap = <Key1, Key2, Value>(): KeyKeyMap<Key1, Key2, Value> => {
  const map = new Map<Key1, Map<Key2, Value>>();

  return {
    set: (key1: Key1, key2: Key2, value: Value) => {
      if (!map.has(key1)) {
        map.set(key1, new Map());
      }

      map.get(key1)?.set(key2, value);
    },

    get: (key1: Key1, key2: Key2) => {
      return map.get(key1)?.get(key2);
    },
  };
};

/**
 * Creates a copy action which can be used to debounce
 * @param getText A function for getting the text to be copied. Can be an empty function if you expect to copy imperatively
 * @param debounce
 * @returns
 */
export const createCopyAction = (getText: () => string | Promise<string>, debounce: number = 300) => {
  const copied: Writable<boolean> = writable(false);
  let lastInteraction: number = Date.now();

  /**
   * Copy function which can be used as an event handler—like `on:click={copy}`, but also allow imperative usage —like `onCopy() { copy("text"); }`
   */
  type CopyFunction = {
    (text?: string): Promise<void> | void;
    /**
     * Usage as an event handler
     */
    (text?: unknown): Promise<void> | void;
  };

  async function copy(text?: string) {
    lastInteraction = Date.now();

    if (typeof text !== "string") {
      text = await getText();
    }

    if (typeof text === "string") {
      await navigator.clipboard.writeText(text);
    } else {
      // nothing copied
      return;
    }

    if ("vibrate" in navigator) {
      await navigator.vibrate(50);
    }

    if (get(copied) === false) {
      copied.set(true);
    }

    await wait(debounce);

    if (Date.now() - lastInteraction > 100) {
      copied.set(false);
    }
  }

  return {
    copy: copy as CopyFunction,
    copied: readonly(copied),
  };
};
