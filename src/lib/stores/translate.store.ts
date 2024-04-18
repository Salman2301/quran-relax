import { writable, type Writable } from "svelte/store";

export const translation: Writable<string[]> = writable([]);
