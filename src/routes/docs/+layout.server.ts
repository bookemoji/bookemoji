import { createDocs } from "$lib/server/docs.js";
import type { LayoutServerLoad } from "./$types.js";

export const load: LayoutServerLoad = async ({}) => {
  const { docs, tableOfContents } = await createDocs();

  return {
    docs,
    tableOfContents,
  };
};
