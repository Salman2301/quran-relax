import { writable, type Writable } from "svelte/store";

export const themeBackgroundColor: Writable<string> = writable("#212121");
export const themeFontColor: Writable<string> = writable("#fff");
export const themeFontFamily: Writable<string> = writable("cursive");
export const themeFontSize: Writable<string> = writable("16px");
