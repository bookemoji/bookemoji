import type { EntryGenerator, PageLoad } from "./$types.js";
import { generateVariantEntries } from "$lib/entry-generators.js";
import { variantLayoutLoad } from "$lib/loaders.js";

export const load: PageLoad = variantLayoutLoad;

export const entries: EntryGenerator = generateVariantEntries();
