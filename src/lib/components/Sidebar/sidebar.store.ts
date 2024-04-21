import { writable, type Writable } from "svelte/store";

export const showSidebar: Writable<"reciter" | null > = writable(null);
