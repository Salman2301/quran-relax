import data from "$lib/components/Sidebar/sidebars/Reciters/data";
import { derived, writable, type Readable, type Writable } from "svelte/store";

export const isContentLoading: Writable<boolean> = writable(true);
export const currentReciter: Writable<string> = writable("as-sudais");
export const currentReciterName: Readable<string> = derived(currentReciter, ($currentReciter) => {
  return data.find(e => e.reciter_id === $currentReciter)?.name || "";
});
export const currentRecitationId: Writable<number> = writable(3);
export const isPlaying: Writable<boolean> = writable(false);
