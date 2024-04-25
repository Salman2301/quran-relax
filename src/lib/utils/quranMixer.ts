import {
	currentRecitationUrl,
	setNextVerse,
	isContentLoading,
	masterVolume,
	isPlaying,
	isMute,
	currentReciterVolume
} from '$lib/stores/player.store';
import { get } from 'svelte/store';

class QuranMixer {
	audioContext: AudioContext;
	audioGainNode: GainNode;
	
	convolverNode: ConvolverNode; // reverb
	convolverGainNode: GainNode;

	playbackRate: number;
	lastSourceNode: AudioBufferSourceNode | null;
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

		this.convolverNode = this.audioContext.createConvolver();
		this.convolverGainNode = this.audioContext.createGain();
		// this.convolverNode.gain
		this.convolverGainNode.gain.value = 1;
		this.convolverNode.connect(this.audioGainNode);
		this.convolverGainNode.connect(this.audioGainNode);
		
		this.loadImpulseResponse('sounds/impulse_response.mp4');

		this.lastSourceNode = null;
		this.playbackRate = 1;


		this.currentVerseId = '007-001-001';
		this.verseFile = {};
		this.verseSource = {};
	}

	async loadImpulseResponse(url: string) {
		try {
				const response = await fetch(url);
				const arrayBuffer = await response.arrayBuffer();
				const impulseBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
				this.convolverNode.buffer = impulseBuffer; // Assign impulse response to convolver
		} catch (e) {
				console.error('Failed to load impulse response:', e);
		}
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

			isContentLoading.set(false);

			console.timeEnd('load');

			return true;
		} catch (error) {
			console.log('Error loading audio files', error);
			return false;
		}
	}

	setPlaybackRate(rate: number) {
		this.playbackRate = rate;
		if (this.lastSourceNode) {
			this.lastSourceNode.playbackRate.value = this.playbackRate;
		}
	}

	setReverbLevel(level: number) {
		this.convolverGainNode.gain.value = level;
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

		if (this.lastSourceNode) {
			this.lastSourceNode.onended = null;
			this.lastSourceNode.stop(0);
			this.lastSourceNode.disconnect();
		}

		const source = this.audioContext.createBufferSource();
		source.buffer = this.verseFile[id];
		source.connect(this.convolverGainNode);
		source.start();

		source.onended = () => {
			setNextVerse(false);
		};

		source.playbackRate.value = this.playbackRate;

		this.lastSourceNode = source;
		this.verseSource[id] = source;
		this.currentVerseId = id;
		return true;
	}

	stop() {
		if (!this.verseFile[this.currentVerseId]) return;
		this.verseSource[this.currentVerseId].stop();
		delete this.verseSource[this.currentVerseId];
		return true;
	}

	updateVolume() {
		const $currentReciterVolume = get(currentReciterVolume);
		const $masterVolume = get(masterVolume);
		const $isMute = get(isMute);
		
		this.audioGainNode.gain.value = $isMute ? 0 : $currentReciterVolume * $masterVolume;
		return true;
	}
}

let quranMixer: QuranMixer;
export async function initQuranMixer() {
	if (quranMixer) return quranMixer;
	if (typeof window === 'undefined') return;
	quranMixer = new QuranMixer();
	window.quranMixer = quranMixer;
	
	masterVolume.subscribe(() => quranMixer.updateVolume());
	currentReciterVolume.subscribe(() => quranMixer.updateVolume());
	isMute.subscribe(() => quranMixer.updateVolume());

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
