import {
	currentRecitationUrl,
	setNextVerse,
	isContentLoading,
	masterVolume
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
			this.verseFile[id] = (await loadAudio(
				get(currentRecitationUrl),
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
		if (isPlaying) this.audioContext.resume();
		else this.audioContext.suspend();
	}

	async play(id: string) {
		if (!this.verseFile[id]) {
			await this.loadVerseFile(id);
			console.log('Missing Audio downloading current verse');
		}

		this.stop();

		const source = this.audioContext.createBufferSource();
		source.buffer = this.verseFile[id];

		source.connect(this.audioGainNode);
		source.onended = () => this.nextVerse();
		// console.log(this.sourceSoundEffects[soundEffect]);
		source.start(0, this.lastElapsedTime);
		this.verseSource[id] = source;
		this.currentVerseId = id;
		return true;
	}

	stop() {
		if (!this.verseFile[this.currentVerseId]) return;
		console.log('stopping verse file...', this.currentVerseId);
		console.log(this.verseFile[this.currentVerseId].duration, this.audioContext.currentTime);
		this.lastElapsedTime =
			this.audioContext.currentTime - this.verseSource[this.currentVerseId].context.currentTime; // % this.soundEffectsFile[soundEffect].duration);

		console.log({ elapsedTime: this.lastElapsedTime });
		this.verseSource[this.currentVerseId].stop();
		delete this.verseSource[this.currentVerseId];
		return true;
	}

	nextVerse() {
		setNextVerse();
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
	// await quranMixer.loadVerseFile('001-001-001');
	// quranMixer.play("001-001-001")
	// masterVolume.subscribe(() => soundEffectsMixer.onMasterVolumeChange());
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
