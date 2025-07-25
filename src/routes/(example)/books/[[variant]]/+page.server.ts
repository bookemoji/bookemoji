import { redirect, type ServerLoad } from "@sveltejs/kit";

/**
 * Previously the sample was at the default `/books`, but for SEO-link reasons of the website we want the url to match the link text
 */
export const load: ServerLoad = ({ url }) => {
  const currentPath = url.pathname.replace("/books", "/example").toLowerCase();
  redirect(308, currentPath);
};
