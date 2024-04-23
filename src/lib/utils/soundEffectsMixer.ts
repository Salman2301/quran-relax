import { isContentLoading, masterVolume, isPlaying, isMute } from '$lib/stores/player.store';
import { soundEffects, soundStore } from '$lib/stores/soundEffects.store';
import { get } from 'svelte/store';

class SoundEffectsMixer {
	soundEffectsContext: { [key: string]: AudioContext };
	soundEffectsFile: { [key: string]: AudioBuffer };
	soundEffectGains: { [key: string]: GainNode };
	soundEffectsSource: { [key: string]: AudioBufferSourceNode };
	soundEffectsInit: { [key: string]: boolean };

	constructor() {
		this.soundEffectsFile = {};
		this.soundEffectsContext = {};
		this.soundEffectGains = {};
		this.soundEffectsSource = {};
		this.soundEffectsInit = {};

		for (const soundEffect of soundEffects) {
			this.soundEffectsContext[soundEffect] = this.createAndResumeAudioContext() as AudioContext;
			this.soundEffectsContext[soundEffect].suspend();
			this.soundEffectsInit[soundEffect] = false;
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

	async loadSoundEffectsFile() {
		try {
			console.time('load');
			const promiseAudio = soundEffects.map(async (soundEffect) => {
				this.soundEffectsContext[soundEffect] = this.createAndResumeAudioContext() as AudioContext;
				this.soundEffectsFile[soundEffect] = await loadAudio(
					`${soundEffect}.mp3`,
					this.soundEffectsContext[soundEffect]
				);

				if (!this.soundEffectsFile[soundEffect]) {
					console.info('Audio file not loaded yet');
					return false;
				}

				const source = this.soundEffectsContext[soundEffect].createBufferSource();
				source.buffer = this.soundEffectsFile[soundEffect];
				source.loop = true;

				this.soundEffectGains[soundEffect] = this.soundEffectsContext[soundEffect].createGain();
				this.soundEffectGains[soundEffect].gain.value = 1;

				this.soundEffectGains[soundEffect].connect(
					this.soundEffectsContext[soundEffect].destination
				);

				source.connect(this.soundEffectGains[soundEffect]);
				this.soundEffectsSource[soundEffect] = source;
				// this.soundEffectsSource[soundEffect].start();
				// this.soundEffectsContext[soundEffect].suspend();
				

				return;
			});

			await Promise.all(promiseAudio);

			isContentLoading.set(false);

			console.timeEnd('load');

			return true;
		} catch (error) {
			console.error('Error loading audio files', error);
			return false;
		}
	}

	activateSoundEffect(soundEffect: string, isPlaying: boolean) {
		if (isPlaying) this.playSoundEffect(soundEffect);
		else this.stopSoundEffect(soundEffect);
	}

	toggleSoundEffect(soundEffect: string, isPlaying: boolean) {
		if (isPlaying) {
			this.soundEffectsContext[soundEffect].resume();
		} else {
			this.soundEffectsContext[soundEffect].suspend();
		}
	}

	async playSoundEffect(soundEffect: string) {
		if (!this.soundEffectsInit[soundEffect]) {
			this.soundEffectsSource[soundEffect].start();	
		}

		this.soundEffectsInit[soundEffect] = true;
		this.soundEffectGains[soundEffect].gain.value = this.calcVolume(soundEffect);

		this.soundEffectsContext[soundEffect].resume();

		return true;
	}

	stopSoundEffect(soundEffect: string) {
		if (!this.soundEffectsSource[soundEffect]) {
			return false;
		}
		this.soundEffectsContext[soundEffect].suspend();
		return true;
	}

	setIsPlaying() {
		const $soundStore = get(soundStore);
		const $isPlaying = get(isPlaying);

		for (const soundEffect of soundEffects) {
			if ($isPlaying && $soundStore[soundEffect].active) {
				this.playSoundEffect(soundEffect);
			} else {
				this.stopSoundEffect(soundEffect);
			}
		}
	}

	calcVolume(soundEffect: string) {
		const $masterVolume = get(masterVolume);
		const $isMute = get(isMute);
		const $soundStore = get(soundStore);

		const currVol = $isMute ? 0 : $soundStore[soundEffect].volume * $masterVolume;
		return currVol;
	}

	onMasterVolumeChange() {
		for (const soundEffect of soundEffects) {
			if (this?.soundEffectGains?.[soundEffect]) {
				this.soundEffectGains[soundEffect].gain.value = this.calcVolume(soundEffect);
			}
		}
	}
}

let soundEffectsMixer: SoundEffectsMixer;
export async function initSoundEffectsMixer() {
	if (soundEffectsMixer) return soundEffectsMixer;
	soundEffectsMixer = new SoundEffectsMixer();
	window.soundEffectsMixer = soundEffectsMixer;
	await soundEffectsMixer.loadSoundEffectsFile();
	masterVolume.subscribe(() => soundEffectsMixer.onMasterVolumeChange());
	isMute.subscribe(() => soundEffectsMixer.onMasterVolumeChange());
	soundStore.subscribe(() => soundEffectsMixer.onMasterVolumeChange());
	return soundEffectsMixer;
}

isPlaying.subscribe(async () => {
	if (typeof window === 'undefined') return;
	(await initSoundEffectsMixer())?.setIsPlaying?.();
});

async function loadAudio(url: string, context: AudioContext) {
	const response = await fetch(`/sounds/${url}`);
	const arrayBuffer = await response.arrayBuffer();
	return await context.decodeAudioData(arrayBuffer);
}
