import { type RequestHandler } from "@sveltejs/kit";
import { createServerGET } from "$lib/loaders.js";

export const GET: RequestHandler = createServerGET();

export const prerender = true;
