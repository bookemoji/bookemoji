import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { base } from "$app/paths";

export const load: PageServerLoad = () => {
  redirect(307, `${base}/docs/getting-started`);
};
