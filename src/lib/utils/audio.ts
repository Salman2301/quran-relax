class AudioMixer {
  audioContext: AudioContext;
  masterGainNode: GainNode;
  audioFiles: { [key: string]: AudioBuffer };
  audioGains: { [key: string]: GainNode };
  sources: { [key: string]: AudioBufferSourceNode };

	constructor() {
		this.audioContext = this.createAndResumeAudioContext() as AudioContext;
		this.masterGainNode = this.audioContext.createGain();
		this.masterGainNode.gain.value = 0.5;
		this.masterGainNode.connect(this.audioContext.destination);
		this.audioFiles = {};
		this.audioGains = {};
		this.sources = {};
	}

	createAndResumeAudioContext(): AudioContext | null {
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

	async loadAudioFiles() {
		try {
			this.audioFiles.rain = await loadAudio('rain.mp3', this.audioContext);
			this.audioFiles.thunder = await loadAudio('thunder.mp3', this.audioContext);
			this.audioFiles.bird = await loadAudio('bird.mp3', this.audioContext);
			this.audioFiles.campfire = await loadAudio('campfire.mp3', this.audioContext);
			this.audioFiles.wind = await loadAudio('wind.mp3', this.audioContext);
			this.audioFiles.river = await loadAudio('river.mp3', this.audioContext);
      this.audioFiles.ocean = await loadAudio('ocean.mp3', this.audioContext);
      
    
			console.log('Audio files loaded successfully');
			return true;
		}
		catch (error) {
			console.log('Error loading audio files', error);
			return false;
		}
	}

	play(sound: string) {
		if (!this.audioFiles[sound]) {
			console.log('Audio file not loaded yet');
			return false;
    }
    
    console.log("playing sound file...", sound)
		const source = this.audioContext.createBufferSource();
		source.buffer = this.audioFiles[sound];
		source.connect(this.masterGainNode);
		source.start();
		this.sources[sound] = source; // Store the source for stopping later
		return true;
	}

	stop(sound: string) {
		if (!this.sources[sound]) {
			console.log('Audio is not playing');
			return false;
    }
    console.log("stopping sound file...", sound)
		this.sources[sound].stop();
		delete this.sources[sound];
		return true;
	}

	setVolume(sound: string, volume: number ) {
		if (!this.audioFiles[sound]) {
			console.log('Audio file not loaded yet');
			return false;
		}
		if (!this.audioGains[sound]) {
			this.audioGains[sound] = this.audioContext.createGain();
			this.audioGains[sound].connect(this.masterGainNode);
		}
		this.audioGains[sound].gain.value = volume;
		return true;
	}

  // Add methods for other effects like reverb
  
}

let mixer: AudioMixer;
export async function getMixer() {
  if (mixer) return mixer;
	mixer = new AudioMixer();
	await mixer.loadAudioFiles();
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
