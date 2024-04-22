import data, { reciterIdMapUrl } from '$lib/components/Sidebar/sidebars/Reciters/data';
import { initQuranMixer } from '$lib/utils/quranMixer';
import { findJuz } from '$lib/utils/juz';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

import surahMaxVerseCount from '$lib/constant/surah-map-verse';
import surahMapVerseAr from '$lib/constant/surah-map-verse-ar';
import surahMapInfo from '$lib/constant/surah-map-info';

export const isContentLoading: Writable<boolean> = writable(true);

export const currentReciter: Writable<string> = writable('as-sudais');
export const currentReciterName: Readable<string> = derived(currentReciter, ($currentReciter) => {
	return data.find((e) => e.reciter_id === $currentReciter)?.name || '';
});
export const currentReciterVolume: Writable<number> = writable(1);

export const currentRecitationId: Writable<number> = writable(3);
export const currentVerseId: Writable<number> = writable(1);
export const currentSurahId: Writable<number> = writable(1);
export const currentJuz: Readable<number> = derived([currentSurahId, currentVerseId],
	([$currentSurahId, $currentVerseId])=>findJuz($currentSurahId, $currentVerseId)
)

export const currentTranslationId: Writable<string> = writable('en.arberry');

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
export const nextVerse: Writable<string> = writable('');

export const isPlaying: Writable<boolean> = writable(false);
export const masterVolume: Writable<number> = writable(1);
export const isMute: Writable<boolean> = writable(false);
export const replayMode: Writable<'surah' | 'verse' | 'off'> = writable('off');

export const currentRecitationUrl: Writable<string|null> = writable(null);

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

export async function setNextVerse() {
	(await initQuranMixer())?.suspend();
	const $currentSurahId = get(currentSurahId);
	const $currentVerseId = get(currentVerseId);

	let nextVerse = $currentVerseId + 1;
	const maxVerse = surahMaxVerseCount[$currentSurahId];
	if (nextVerse > maxVerse) {
		nextVerse = 1;
		let nextSurah = $currentSurahId + 1;
		nextSurah = nextSurah <= 114 ? nextSurah : 1;
		currentSurahId.set(nextSurah);
	}
	currentVerseId.set(nextVerse);
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
	const [$currentRecitationId, $currentVerseId, $currentSurahId] =
		[currentRecitationId, currentVerseId, currentSurahId].map(get);
	
	const padZero = (num: number) => String(num).padStart(3, '0');
	const surahVerseId = `${padZero($currentSurahId)}${padZero($currentVerseId)}`;

	let url = reciterIdMapUrl[$currentRecitationId];
	url = url.replace('<id>', surahVerseId);
	currentRecitationUrl.set(url);
}

currentReciter.subscribe(() => {
	setUrlFromId();
})

isPlaying.subscribe(async ($isPlaying) => {
	(await initQuranMixer())?.setIsPlaying($isPlaying);
});

currentRecitationUrl.subscribe(async ($currentRecitationUrl) => {
	const quranMixer = await initQuranMixer();
	console.log("trying to play?...", $currentRecitationUrl, quranMixer)
	$currentRecitationUrl && quranMixer?.play($currentRecitationUrl);
});
