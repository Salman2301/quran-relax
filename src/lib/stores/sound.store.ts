import { writable, type Writable } from "svelte/store";

interface SoundStore {
  [index: string]: {
    id: string;
    active: boolean;
    volume: number;
    speed: number;
    reverb: number;
  };
}

export const soundStore: Writable<SoundStore> = writable({
  rain: {
    id: "rain",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  },
  thunder: {
    id: "thunder",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  },
  bird: {
    id: "bird",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  },
  campfire: {
    id: "campfire",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  },
  wind: {
    id: "wind",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  },
  river: {
    id: "river",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  },
  ocean: {
    id: "ocean",
    active: false,
    volume: 0.5,
    speed: 1,
    reverb: 1
  }
});