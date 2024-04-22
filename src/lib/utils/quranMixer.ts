import {
	currentRecitationUrl,
	setNextVerse,
	isContentLoading,
	masterVolume,
	isPlaying
} from '$lib/stores/player.store';
import { get } from 'svelte/store';

class QuranMixer {
	audioContext: AudioContext;
	audioGainNode: GainNode;
	lastElapsedTime: number;

	currentVerseId: string;
	verseFile: { [key: string]: AudioBuffer };
	verseSource: { [key: string]: AudioBufferSourceNode };

	constructor() {
		// if (typeof Window === "undefined") return;
		this.audioContext = this.createAndResumeAudioContext() as AudioContext;
		if (!this.audioContext) throw new Error('Failed to init Audio');

		this.audioGainNode = this.audioContext.createGain();
		this.audioGainNode.gain.value = 0.5;
		this.audioGainNode.connect(this.audioContext.destination);

		this.currentVerseId = '003-001-001';
		this.lastElapsedTime = 0;
		this.verseFile = {};
		this.verseSource = {};

		this.audioContext.onstatechange = () => {
			console.log('c', this.audioContext.state);
		};
	}

	createAndResumeAudioContext(): AudioContext | null {
		if (typeof window === 'undefined') return null;
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (AudioContext) {
			const audioContext = new AudioContext();
			if (audioContext.state === 'suspended') {
				const resumeContext = () => {
					audioContext.resume().then(() => {
						document.removeEventListener('click', resumeContext);
						document.removeEventListener('touchstart', resumeContext);
					});
				};
				document.addEventListener('click', resumeContext);
				document.addEventListener('touchstart', resumeContext);
			}
			return audioContext;
		} else {
			console.error('Web Audio API is not supported in this browser');
			return null;
		}
	}

	async loadVerseFile(id: string) {
		try {
			console.time('load');
			const $currentRecitationUrl = get(currentRecitationUrl);
			if (!$currentRecitationUrl) return;

			this.verseFile[id] = (await loadAudio(
				$currentRecitationUrl,
				this.audioContext
			)) as AudioBuffer;
			this.lastElapsedTime = 0;

			isContentLoading.set(false);

			console.timeEnd('load');

			console.log('Audio files loaded successfully');
			return true;
		} catch (error) {
			console.log('Error loading audio files', error);
			return false;
		}
	}

	setIsPlaying(isPlaying: boolean) {
		if (isPlaying) this.resume();
		else this.suspend();
	}

	resume() {
		if(get(isPlaying)) this.audioContext.resume();
	}
	suspend() {
		this.audioContext.suspend();
	}

	async play(id: string) {
		if (!get(isPlaying)) return;
		if (!this.verseFile[id]) {
			await this.loadVerseFile(id);
			console.log('Missing Audio downloading current verse');
		}
		console.log("trying play: ", id)
		// this.stop();

		const source = this.audioContext.createBufferSource();
		source.buffer = this.verseFile[id];

		source.connect(this.audioGainNode);
		source.start();

		console.log("Playing : ", id);
		source.onended = () => {
			console.log({ source })
			setNextVerse();
		};
		this.verseSource[id] = source;
		this.currentVerseId = id;
		return true;
	}

	stop() {
		
		console.log("Playing : ", this.currentVerseId);
		if (!this.verseFile[this.currentVerseId]) return;
		console.log('stopping verse file...', this.currentVerseId);
		this.lastElapsedTime =
			this.audioContext.currentTime - this.verseSource[this.currentVerseId].context.currentTime;

		this.verseSource[this.currentVerseId].stop();
		delete this.verseSource[this.currentVerseId];
		return true;
	}

	setVolume(volume: number) {
		const $masterVolume = get(masterVolume);
		this.audioGainNode.gain.value = volume * $masterVolume;
		return true;
	}
}

let quranMixer: QuranMixer;
export async function initQuranMixer() {
	if (quranMixer) return quranMixer;
	if (typeof window === 'undefined') return;
	quranMixer = new QuranMixer();
	window.quranMixer = quranMixer;
	return quranMixer;
}

async function loadAudio(url: string, context: AudioContext) {
	try {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return await context.decodeAudioData(arrayBuffer);
	} catch (e) {
		console.error(e);
		console.error(url);
		throw new Error('Failed to load verse');
	}
}
