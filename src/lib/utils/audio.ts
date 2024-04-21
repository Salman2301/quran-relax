import { isContentLoading, masterVolume } from '$lib/stores/player.store';
import { soundEffects, soundStore } from '$lib/stores/soundEffects.store';
import { get } from 'svelte/store';

class AudioMixer {
	audioContext: AudioContext;
	soundEffectsContext: { [key: string]: AudioContext };
	soundEffectsFile: { [key: string]: AudioBuffer };
	soundEffectGains: { [key: string]: GainNode };
	sourceLastElapsedTime: { [key: string]: number };
	sourceSoundEffects: { [key: string]: AudioBufferSourceNode };

	constructor() {
		this.audioContext = this.createAndResumeAudioContext() as AudioContext;
		if (!this.audioContext) throw new Error('Failed to init Audio');

		this.soundEffectsFile = {};
		this.soundEffectsContext = {};
		this.soundEffectGains = {};
		this.sourceLastElapsedTime = {};
		this.sourceSoundEffects = {};

		for (const soundEffect of soundEffects) {		
			this.soundEffectsContext[soundEffect] = this.createAndResumeAudioContext() as AudioContext;	
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
				this.sourceLastElapsedTime[soundEffect] = 0;
				return;
			});

			await Promise.all(promiseAudio);

			isContentLoading.set(false);

			console.timeEnd('load');

			console.log('Audio files loaded successfully');
			return true;
		} catch (error) {
			console.log('Error loading audio files', error);
			return false;
		}
	}

	setIsPlayingSoundEffect(soundEffect: string, isPlaying: boolean, volume?: number) {
		if (isPlaying) this.playSoundEffect(soundEffect, volume);
		else this.stopSoundEffect(soundEffect);
	}

	toggleSoundEffect(soundEffect: string, isPlaying: boolean) {
	  if (isPlaying) {
			this.soundEffectsContext[soundEffect].resume();
	  } else {
			this.soundEffectsContext[soundEffect].suspend();
	  }
	}

	playSoundEffect(soundEffect: string, volume?: number) {
		if (!this.soundEffectsFile[soundEffect]) {
			console.log('Audio file not loaded yet');
			return false;
		}

		console.log('playing sound file...', soundEffect);
		const source = this.soundEffectsContext[soundEffect].createBufferSource();
		source.buffer = this.soundEffectsFile[soundEffect];
		source.loop = true;

		
		this.soundEffectGains[soundEffect] = this.soundEffectsContext[soundEffect].createGain();
		this.soundEffectGains[soundEffect].gain.value = volume || 1;
		this.soundEffectGains[soundEffect].connect(this.soundEffectsContext[soundEffect].destination);


		source.connect(this.soundEffectGains[soundEffect]);
		console.log(this.sourceSoundEffects[soundEffect]);
		source.start(0, this.sourceLastElapsedTime[soundEffect]);
		this.sourceSoundEffects[soundEffect] = source;

		return true;
	}

	stopSoundEffect(soundEffect: string) {
		if (!this.sourceSoundEffects[soundEffect]) {
			console.log('Audio is not playing');
			return false;
		}
		console.log('stopping sound file...', soundEffect);
		console.log(
			this.soundEffectsFile[soundEffect].duration,
			this.sourceSoundEffects[soundEffect].context.currentTime
		);
		this.sourceLastElapsedTime[soundEffect] =
		this.soundEffectsContext[soundEffect].currentTime - this.sourceSoundEffects[soundEffect].context.currentTime; // % this.soundEffectsFile[soundEffect].duration);

		console.log({ elapsedTime: this.sourceLastElapsedTime[soundEffect] });
		this.sourceSoundEffects[soundEffect].stop();
		delete this.sourceSoundEffects[soundEffect];
		return true;
	}

	setIsPlaying(isPlaying: boolean) {
		if (isPlaying) {
			this.audioContext.suspend();
			for (const soundEffect of soundEffects) {
				this.soundEffectsContext[soundEffect].suspend();
			}
		}
		else {
			this.audioContext.resume();
			
			for (const soundEffect of soundEffects) {
				this.soundEffectsContext[soundEffect].resume();
			}
		}
	}

	setVolume(soundEffect: string, volume: number) {
		this.soundEffectGains[soundEffect].gain.value = volume;
		return true;
	}

	onMasterVolumeChange() {
		const $soundStore = get(soundStore);
		const $masterVolume = get(masterVolume);

		for (const soundEffect of soundEffects) {			
			if (this?.soundEffectGains?.[soundEffect]) {
				this.soundEffectGains[soundEffect].gain.value = $soundStore[soundEffect].volume * $masterVolume;
				
			}
		}

	}
}

let mixer: AudioMixer;
export async function initMixer() {
	if (mixer) return mixer;
	mixer = new AudioMixer();
	window.mixer = mixer;
	await mixer.loadSoundEffectsFile();
	masterVolume.subscribe(()=>mixer.onMasterVolumeChange());
	return mixer;
}

async function loadAudio(url: string, context: AudioContext) {
	const response = await fetch(`/sounds/${url}`);
	const arrayBuffer = await response.arrayBuffer();
	return await context.decodeAudioData(arrayBuffer);
}
