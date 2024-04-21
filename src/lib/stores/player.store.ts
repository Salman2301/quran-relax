import data, { reciterIdMapUrl } from '$lib/components/Sidebar/sidebars/Reciters/data';
import { initQuranMixer } from '$lib/utils/quranMixer';
import surahMaxVerseCount from '$lib/constant/surah-map-data';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

export const isContentLoading: Writable<boolean> = writable(true);
export const currentReciter: Writable<string> = writable('as-sudais');
export const currentReciterName: Readable<string> = derived(currentReciter, ($currentReciter) => {
	return data.find((e) => e.reciter_id === $currentReciter)?.name || '';
});
export const currentReciterVolume: Writable<number> = writable(1);

export const currentRecitationId: Writable<number> = writable(3);
export const currentVerseId: Writable<number> = writable(1);
export const currentSurahId: Writable<number> = writable(1);

export const currentRecitationUrl: Readable<string> = derived(
	[currentRecitationId, currentVerseId, currentSurahId],
	([$currentRecitationId, $currentVerseId, $currentSurahId]) => {
		const padZero = (num: number) => String(num).padStart(3, '0');
		const surahVerseId = `${padZero($currentSurahId)}${padZero($currentVerseId)}`;

		let url = reciterIdMapUrl[$currentRecitationId];
		url = url.replace('<id>', surahVerseId);
		return url;
	}
);

export const isPlaying: Writable<boolean> = writable(false);
export const masterVolume: Writable<number> = writable(1);
export const isMute: Writable<boolean> = writable(false);
export const replayMode: Writable<'surah' | 'verse' | 'off'> = writable('off');

export function setPrevVerse() {

	const $currentSurahId = get(currentSurahId);
	const $currentVerseId = get(currentVerseId);
	// check and get know if surah
  const prevVerse = $currentVerseId - 1;
  
  if (prevVerse < 1) {
    currentSurahId.set($currentSurahId - 1 || 1);
  }
	currentVerseId.set(prevVerse);

}

export function setNextVerse() {
	const $currentSurahId = get(currentSurahId);
	const $currentVerseId = get(currentVerseId);
	// check and get know if surah
	let nextVerse = $currentVerseId + 1;
	const maxVerse = surahMaxVerseCount[$currentSurahId];
	if (nextVerse > maxVerse) nextVerse = 1;
	currentVerseId.set(nextVerse);
}

isPlaying.subscribe(async ($isPlaying) => {
	(await initQuranMixer())?.setIsPlaying($isPlaying);
});

currentRecitationUrl.subscribe(async ($currentRecitationUrl) => {
	const quranMixer = await initQuranMixer();
	console.log('playing ', $currentRecitationUrl);
	quranMixer?.play($currentRecitationUrl);
});
