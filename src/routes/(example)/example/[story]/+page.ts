import type { PageLoad, EntryGenerator } from "./$types.js";
import { createStoryEntryGenerator } from "$lib/entry-generators.js";

export const load: PageLoad = async ({ parent }) => {
  const { Book, name } = await parent();
  return { Book, name };
};

export const entries: EntryGenerator = createStoryEntryGenerator();
