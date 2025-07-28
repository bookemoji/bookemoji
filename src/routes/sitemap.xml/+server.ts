import { articles } from "$lib/server/articles.js";
import { createDocs } from "$lib/server/docs.js";
import type { RequestHandler } from "@sveltejs/kit";

// tweaked from https://sveltekit.io/blog/svelte-sitemaps
const site = "https://bookemoji.dev"; // change this to reflect your domain

export const prerender = true;

export const GET: RequestHandler = async ({ url, fetch }) => {
  const docPages = await createDocs();

  const pages: string[] = [
    "",
    "docs",
    //
    ...Array.from(docPages.tableOfContents.keys()).map((k) => `docs/${k}`),
    "example",
    "blog",
    ...articles.filter((a) => a.published).map((a) => `blog/${a.slug}`),
  ];

  const body = sitemap(pages);
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
};

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${site}/${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
  `,
    )
    .join("")}
</urlset>`;
