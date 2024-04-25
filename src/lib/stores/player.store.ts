import data, { reciterIdMapUrl } from '$lib/components/Sidebar/sidebars/Reciters/data';
import { initQuranMixer } from '$lib/utils/quranMixer';
import { findJuz } from '$lib/utils/juz';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

import surahMaxVerseCount from '$lib/constant/surah-map-verse';
import surahMapVerseAr from '$lib/constant/surah-map-verse-ar';
import surahMapInfo from '$lib/constant/surah-map-info';

export const isContentLoading: Writable<boolean> = writable(true);

export const currentReciter: Writable<string> = writable(getFromStorage("currentReciter",'al-afasy') as string); // Also update currentRecitationId
export const currentReciterName: Readable<string> = derived(currentReciter, ($currentReciter) => {
	return data.find((e) => e.reciter_id === $currentReciter)?.name || '';
});
export const currentReciterVolume: Writable<number> = writable(getFromStorage("currentReciterVolume", 1, "number") as number);

export const currentReciterSpeed: Writable<number> = writable(getFromStorage("currentReciterSpeed", 1, "number") as number);

export const currentReciterReverb: Writable<number> = writable(getFromStorage("currentReciterReverb", 5, "number") as number);

export const currentRecitationId: Writable<number> = writable(getFromStorage("currentRecitationId", 7, "number") as number);
export const currentVerseId: Writable<number> = writable(getFromStorage("currentVerseId", 1, "number") as number);
export const currentSurahId: Writable<number> = writable(getFromStorage("currentSurahId", 1, "number") as number);
export const currentJuz: Readable<number> = derived(
	[currentSurahId, currentVerseId],
	([$currentSurahId, $currentVerseId]) => findJuz($currentSurahId, $currentVerseId)
);

export const currentTranslationId: Writable<string> = writable(getFromStorage("currentTranslationId", "en.arberry") as string);

export const currentArFontFamily: Writable<string> = writable(getFromStorage("currentArFontFamily", "Rubik") as string);
export const currentArFontSize: Writable<number> = writable(getFromStorage("currentArFontSize", 32, "number") as number);
export const currentTrFontSize: Writable<number> = writable(getFromStorage("currentTrFontSize", 16, "number") as number);

export const currentSurahName: Readable<string> = derived(currentSurahId, ($currentSurahId) => {
	const info = surahMapInfo[$currentSurahId - 1];
	return `${$currentSurahId} - ${info.title}`;
});

export const currentVerseAr: Readable<string> = derived(
	[currentSurahId, currentVerseId],
	([$currentSurahId, $currentVerseId]) => {
		return surahMapVerseAr[`${$currentSurahId}:${$currentVerseId}`];
	}
);
export const currentVerseTr: Readable<Promise<string>> = derived(
	[currentSurahId, currentVerseId, currentTranslationId],
	async ([$currentSurahId, $currentVerseId, $currentTranslationId]) => {
		const transMap = await getTransTxt($currentTranslationId);
		return transMap[`${$currentSurahId}:${$currentVerseId}`];
	}
);

export const isPlaying: Writable<boolean> = writable(getFromStorage("isPlaying", false, "boolean") as boolean);
export const masterVolume: Writable<number> = writable(getFromStorage("masterVolume", 1, "number") as number);
export const isMute: Writable<boolean> = writable(getFromStorage("isMute", false, "boolean") as boolean);
export const replayMode: Writable<'surah' | 'verse' | 'off'> = writable(getFromStorage("replayMode", "off") as "off");

// this is derived
export const currentRecitationUrl: Writable<string | null> = writable(null);

export async function setPrevVerse() {
	(await initQuranMixer())?.suspend();
	const $currentSurahId = get(currentSurahId);
	const $currentVerseId = get(currentVerseId);

	const prevVerse = $currentVerseId - 1;

	if (prevVerse < 1) {
		const prevSurah = $currentSurahId - 1 || 1;
		currentSurahId.set(prevSurah);
		const lastVerse = surahMaxVerseCount[prevSurah];
		currentVerseId.set(lastVerse);
	} else {
		currentVerseId.set(prevVerse);
	}
	(await initQuranMixer())?.resume();
	setUrlFromId();
}

export async function setPrevSurah() {
	(await initQuranMixer())?.suspend();
	const $currentSurahId = get(currentSurahId);

	const prevSurah = $currentSurahId - 1 || 114;

	currentSurahId.set(prevSurah);
	currentVerseId.set(1);

	(await initQuranMixer())?.resume();
	setUrlFromId();
}

export async function setNextVerse(skipReplay = true) {
	(await initQuranMixer())?.suspend();
	const $currentSurahId = get(currentSurahId);
	const $currentVerseId = get(currentVerseId);
	const $replayMode = get(replayMode);

	let nextVerse = $currentVerseId + 1;
	let nextSurah = $currentSurahId;
	const maxVerse = surahMaxVerseCount[$currentSurahId];
	if (nextVerse > maxVerse) {
		nextVerse = 1;
		if (skipReplay || $replayMode !== 'surah') {
			nextSurah = $currentSurahId + 1;
			nextSurah = nextSurah <= 114 ? nextSurah : 1;
		}
	}

	if (!skipReplay && $replayMode === 'verse') {
		nextVerse = $currentVerseId;
		nextSurah = $currentSurahId;
	}

	currentVerseId.set(nextVerse);
	currentSurahId.set(nextSurah);
	console.log({ $currentVerseId, $currentSurahId, nextVerse });
	(await initQuranMixer())?.resume();
	setUrlFromId();
}

export async function setNextSurah() {
	(await initQuranMixer())?.suspend();
	const $currentSurahId = get(currentSurahId);

	let nextSurah = $currentSurahId + 1;
	nextSurah = nextSurah <= 114 ? nextSurah : 1;

	currentSurahId.set(nextSurah);
	currentVerseId.set(1);

	(await initQuranMixer())?.resume();
	setUrlFromId();
}

const transArrMapId = new Map();
async function getTransTxt(translationId: string) {
	if (transArrMapId.has(translationId)) return transArrMapId.get(translationId);

	const res = await fetch(`/quran/trans/${translationId}.txt`);
	const data = await res.text();
	const lines = data.split('\n').slice(0, 6236);
	const dataArr = lines.map((line) => {
		const [surah, verseNum, verse] = line.split('|');
		return [`${surah}:${verseNum}`, verse];
	});
	const translationArr = Object.fromEntries(dataArr);
	transArrMapId.set(translationId, translationArr);
	return translationArr;
}

export function toggleReplay() {
	const $replayMode = get(replayMode);
	if ($replayMode === 'off') {
		replayMode.set('surah');
	} else if ($replayMode === 'surah') {
		replayMode.set('verse');
	} else {
		replayMode.set('off');
	}
}

export function setUrlFromId() {
	const [$currentRecitationId, $currentVerseId, $currentSurahId] = [
		currentRecitationId,
		currentVerseId,
		currentSurahId
	].map(get);

	const padZero = (num: number) => String(num).padStart(3, '0');
	const surahVerseId = `${padZero($currentSurahId)}${padZero($currentVerseId)}`;

	let url = reciterIdMapUrl[$currentRecitationId];
	url = url.replace('<id>', surahVerseId);

	currentRecitationUrl.set(null);
	currentRecitationUrl.set(url);
}

currentReciter.subscribe(() => {
	setUrlFromId();
});

isPlaying.subscribe(async ($isPlaying) => {
	(await initQuranMixer())?.setIsPlaying($isPlaying);
});

currentReciterSpeed.subscribe(async ($currentReciterSpeed) => {
	(await initQuranMixer())?.setPlaybackRate($currentReciterSpeed);
});

currentReciterReverb.subscribe(async ($currentReciterReverb) => {
	(await initQuranMixer())?.setReverbLevel($currentReciterReverb);
});

currentRecitationUrl.subscribe(async ($currentRecitationUrl) => {
	const quranMixer = await initQuranMixer();
	console.log('trying to play?...', $currentRecitationUrl, quranMixer);
	$currentRecitationUrl && quranMixer?.play($currentRecitationUrl);
});

// Local storage
currentReciter.subscribe(($currentReciter) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentReciter', $currentReciter);
});

currentReciterVolume.subscribe(($currentReciterVolume) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentReciterVolume', String($currentReciterVolume));
});

currentReciterSpeed.subscribe(($currentReciterSpeed) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentReciterSpeed', String($currentReciterSpeed));
});

currentReciterReverb.subscribe(($currentReciterReverb) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentReciterReverb', String($currentReciterReverb));
});

currentRecitationId.subscribe(($currentRecitationId) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentRecitationId', String($currentRecitationId));
});

currentVerseId.subscribe(($currentVerseId) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentVerseId', String($currentVerseId));
});

currentSurahId.subscribe(($currentSurahId) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentSurahId', String($currentSurahId));
});

currentTranslationId.subscribe(($currentTranslationId) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentTranslationId', String($currentTranslationId));
});

currentArFontFamily.subscribe(($currentArFontFamily) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentArFontFamily', String($currentArFontFamily));
});

currentArFontSize.subscribe(($currentArFontSize) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentArFontSize', String($currentArFontSize));
});

currentTrFontSize.subscribe(($currentTrFontSize) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$currentTrFontSize', String($currentTrFontSize));
});

masterVolume.subscribe(($masterVolume) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$masterVolume', String($masterVolume));
});

isMute.subscribe(($isMute) => {
	if (typeof window === "undefined") return;
	localStorage.setItem('store$isMute', String($isMute));
});

replayMode.subscribe(($replayMode) => {
	if (typeof window === "undefined") return;
	console.log("setting local storage!", $replayMode)
	localStorage.setItem('store$replayMode', String($replayMode));
});

function getFromStorage(storeId: string, fallbackVal?:string|number|boolean, type?:string): string|number|boolean|undefined {
	if (typeof window === "undefined") return fallbackVal;

  const val = localStorage.getItem(`store$${storeId}`);
	if (!val || val === "null" || val === "undefined") return fallbackVal;
	if( type === "number" && !isNaN(Number(val))) return Number(val);
	if( type === "boolean") return val === "true";
  return val;
}
