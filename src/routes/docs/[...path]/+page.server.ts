import type { PageServerLoad } from "./$types.js";
import { createDocs, docs } from "$lib/server/docs.js";
import { error } from "@sveltejs/kit";

await createDocs();

export const load: PageServerLoad = async ({ params }) => {
  console.log(docs);
  if (!docs.has(params.path)) {
    error(404, "Page does not exist");
  }

  return {
    path: params.path,
    content: docs.get(params.path) as string,
  };
};
