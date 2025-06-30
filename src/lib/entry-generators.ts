import { findStoryFiles } from "./book-emoji.js";
import type { StoryEntryGenerator, VariantEntryGenerator, VariantRouteParams } from "./sveltekit-runtime-types.js";

/**
 * To be used within a `/[story]/[variant]/+page.ts` type param
 * Creates the `EntryGenerator` for BookEmoji story variants
 */
export const generateVariantEntries = (): VariantEntryGenerator => {
  return async () => {
    // const config: BookEmojiConfig = (await import("$bookemoji.config")).default;
    const bookList = await findStoryFiles();

    const prerenderStories = bookList.map((book) => {
      return Object.values(book.variants).map((variant) => {
        return {
          story: book.slug,
          variant: variant.slug,
        } as VariantRouteParams;
      });
    });

    return prerenderStories.flat();
  };
};

/**
 * To be used within a `/[story]/+page.ts` type param
 * Creates the `EntryGenerator` for BookEmoji story variants
 */
export const createStoryEntryGenerator = (): StoryEntryGenerator => {
  return async () => {
    const bookList = await findStoryFiles();

    const prerenderStories = bookList.map((book) => ({
      story: book.slug,
    }));

    return prerenderStories;
  };
};
