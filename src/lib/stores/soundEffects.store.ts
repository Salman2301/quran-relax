import { writable, type Writable } from "svelte/store";

interface SoundStore {
  [index: string]: {
    id: string;
    active: boolean;
    volume: number;
  };
}

export const soundEffects: string[] = ["rain", "thunder", "bird", "campfire", "wind", "river", "ocean"];

const fallBackSoundStore = {
  rain: {
    id: "rain",
    active: false,
    volume: 1
  },
  thunder: {
    id: "thunder",
    active: false,
    volume: 1
  },
  bird: {
    id: "bird",
    active: false,
    volume: 1
  },
  campfire: {
    id: "campfire",
    active: false,
    volume: 1
  },
  wind: {
    id: "wind",
    active: false,
    volume: 1
  },
  river: {
    id: "river",
    active: false,
    volume: 1
  },
  ocean: {
    id: "ocean",
    active: false,
    volume: 1
  }
}

export const soundStore: Writable<SoundStore> = writable(getSoundStoreFromLocal());

export function getSoundStoreFromLocal() {
  try {
    if (localStorage.getItem("store$soundStore")) {
      const obj = localStorage.getItem("store$soundStore");
      if (typeof obj === "string" && obj.startsWith("{")) {
        return JSON.parse(obj);
      }
    }
    return fallBackSoundStore;
  }
  catch (e) {
    return fallBackSoundStore;
  }
}

soundStore.subscribe($soundStore => {
  if( typeof window === "undefined") return;
  localStorage.setItem("store$soundStore", JSON.stringify($soundStore))
});

