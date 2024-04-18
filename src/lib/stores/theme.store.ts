import { get, writable, type Writable } from "svelte/store";

export const initThemeSync: Writable<boolean> = writable(false);
export const themeBackgroundColor: Writable<string> = writable("#212121");
export const themeFontColor: Writable<string> = writable("#fff");
export const themeFontFamily: Writable<string> = writable("cursive");
export const themeFontSize: Writable<string> = writable("16px");

initThemeSync.subscribe(storeThemeLocal);
themeBackgroundColor.subscribe(storeThemeLocal);
themeFontColor.subscribe(storeThemeLocal);
themeFontFamily.subscribe(storeThemeLocal);
themeFontSize.subscribe(storeThemeLocal);

function storeThemeLocal() {
  if (typeof localStorage === "undefined") return;
  if (!get(initThemeSync)) return;
  localStorage.setItem("themeBackgroundColor", get(themeBackgroundColor));
  localStorage.setItem("themeFontColor", get(themeFontColor));
  localStorage.setItem("themeFontFamily", get(themeFontFamily));
  localStorage.setItem("themeFontSize", get(themeFontSize));
}

export function setFromStore() {
  if (typeof localStorage === "undefined") return;
  themeBackgroundColor.set(
    localStorage.getItem("themeBackgroundColor") || "#212121"
  );
  themeFontColor.set(localStorage.getItem("themeFontColor") || "#fff");
  themeFontFamily.set(
    localStorage.getItem("themeFontFamily") || "cursive"
  );
  themeFontSize.set(localStorage.getItem("themeFontSize") || "16px");
  initThemeSync.set(true);
}
