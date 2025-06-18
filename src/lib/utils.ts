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
