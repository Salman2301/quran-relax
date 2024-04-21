import { isContentLoading } from "$lib/stores/player.store";
import { soundEffects } from "$lib/stores/soundEffects.store";

class AudioMixer {
  audioContext: AudioContext;
  masterGainNode: GainNode;
  soundEffectsFile: { [key: string]: AudioBuffer };
  soundEffectGains: { [key: string]: GainNode };
  sourceSoundEffects: { [key: string]: AudioBufferSourceNode };

	constructor() {
		this.audioContext = this.createAndResumeAudioContext() as AudioContext;
    if (!this.audioContext) throw new Error("Failed to init Audio");
		this.masterGainNode = this.audioContext.createGain();
		this.masterGainNode.gain.value = 0.5;
		this.masterGainNode.connect(this.audioContext.destination);
		this.soundEffectsFile = {};
		this.soundEffectGains = {};
		this.sourceSoundEffects = {};
  }
  
  createAndResumeAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
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
      console.time("load")
      const promiseAudio = soundEffects.map(async soundEffect => {
        this.soundEffectsFile[soundEffect] = await loadAudio(`${soundEffect}.mp3`, this.audioContext);
        return;
      });
      await Promise.all(promiseAudio);

      isContentLoading.set(false);
      
      console.timeEnd("load")
      
			console.log('Audio files loaded successfully');
			return true;
		}
		catch (error) {
			console.log('Error loading audio files', error);
			return false;
		}
	}
	
  setIsPlayingSoundEffect( soundEffect: string, isPlaying: boolean ) {
    if (isPlaying) this.playSoundEffect(soundEffect);
    else this.stopSoundEffect(soundEffect)
  }

	playSoundEffect(soundEffect: string) {
		if (!this.soundEffectsFile[soundEffect]) {
			console.log('Audio file not loaded yet');
			return false;
    }
    
    console.log("playing sound file...", soundEffect)
		const source = this.audioContext.createBufferSource();
		source.buffer = this.soundEffectsFile[soundEffect];
		source.loop = true;

		source.connect(this.masterGainNode);
		source.start();
		this.sourceSoundEffects[soundEffect] = source;
		return true;
	}

	stopSoundEffect(soundEffect: string) {
		if (!this.sourceSoundEffects[soundEffect]) {
			console.log('Audio is not playing');
			return false;
    }
    console.log("stopping sound file...", soundEffect)
		this.sourceSoundEffects[soundEffect].stop();
		delete this.sourceSoundEffects[soundEffect];
		return true;
	}

	setVolume(sound: string, volume: number ) {
		if (!this.soundEffectsFile[sound]) {
			console.log('Audio file not loaded yet');
			return false;
		}
		if (!this.soundEffectGains[sound]) {
			this.soundEffectGains[sound] = this.audioContext.createGain();
			this.soundEffectGains[sound].connect(this.masterGainNode);
		}
		this.soundEffectGains[sound].gain.value = volume;
		return true;
	}
}

let mixer: AudioMixer;
export async function initMixer() {
  if (mixer) return mixer;
	mixer = new AudioMixer();
	await mixer.loadSoundEffectsFile();
  return mixer;
	// mixer.play('rain');
	// mixer.setVolume('rain', 0.8);
	// // Stop the rain after some time
	// setTimeout(() => {
	// 	mixer.stop('rain');
	// }, 5000);
}

async function loadAudio(url: string, context: AudioContext) {
	const response = await fetch(`/sounds/${url}`);
	const arrayBuffer = await response.arrayBuffer();
	return await context.decodeAudioData(arrayBuffer);
}
