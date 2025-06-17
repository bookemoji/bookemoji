import type { BookDefinition, StoryDefinition } from "$lib/book-emoji.js";
import { writable } from "svelte/store";

export const variants = writable<Record<string, StoryDefinition>>({});
