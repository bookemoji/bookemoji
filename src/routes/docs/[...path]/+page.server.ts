import { base } from "$app/paths";
import { createDocs } from "$lib/server/docs.js";
import type { EntryGenerator, PageServerLoad } from "./$types.js";
// import { createDocs, docs } from "$lib/server/docs.js";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, parent }) => {
  const { docs } = await parent();

  if (!docs.has(params.path)) {
    error(404, "Page does not exist");
  }

  return {
    // tableOfContents,
    path: params.path,
    content: docs.get(params.path) as string,
  };
};

export const entries: EntryGenerator = async () => {
  const { docs, tableOfContents } = await createDocs();

  return Object.keys(docs).map((doc) => {
    const slug = `/docs/${doc}`;
    console.log(slug);
    return {
      path: slug,
    };
  });
};
