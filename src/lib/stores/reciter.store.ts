import { writable, type Writable } from "svelte/store";

export const currentReciter: Writable<string> = writable("as-sudais");
export const currentRecitationId: Writable<number> = writable(3);
