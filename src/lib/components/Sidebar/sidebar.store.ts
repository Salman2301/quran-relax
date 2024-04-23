import { writable, type Writable } from "svelte/store";

export const showSidebar: Writable<"reciter" | "surah-selector"| null> = writable(null);
