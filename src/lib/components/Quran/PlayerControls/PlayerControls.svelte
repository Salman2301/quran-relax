<script lang="ts">
	import ControlNext from '$lib/icons/ControlNext.svelte';
	import ControlPause from '$lib/icons/ControlPause.svelte';
	import ControlPlay from '$lib/icons/ControlPlay.svelte';
	import ControlPrev from '$lib/icons/ControlPrev.svelte';
	import ControlReplay from '$lib/icons/ControlReplay.svelte';
	import ControlVolumeFull from '$lib/icons/ControlVolumeFull.svelte';
	import ControlVolumeLow from '$lib/icons/ControlVolumeLow.svelte';
	import ControlVolumeMute from '$lib/icons/ControlVolumeMute.svelte';
	import ControlVolumeZero from '$lib/icons/ControlVolumeZero.svelte';
	import {
		setNextVerse,
		setPrevVerse,
		isMute,
		isPlaying,
		masterVolume,
		replayMode,
		toggleReplay
	} from '$lib/stores/player.store';
	import { initSoundEffectsMixer } from '$lib/utils/soundEffectsMixer';

	function handlePrev() {
		setPrevVerse();
	}
	function handleNext() {
		setNextVerse();
	}

	function handleReplay() {
		toggleReplay();
	}

	function handleToggleMute() {
		$isMute = !$isMute;
	}

	async function playToggle() {
		$isPlaying = !$isPlaying;
		(await initSoundEffectsMixer()).setIsPlaying();
	}
</script>

<div class="container">
	<div class="control-container">
		<div class="volume-controls">
			<button on:click={handleToggleMute} class="volume">
				{#if $isMute}
					<ControlVolumeMute />
				{:else if $masterVolume > 0.8}
					<ControlVolumeFull />
				{:else if $masterVolume > 0.3}
					<ControlVolumeLow />
				{:else}
					<ControlVolumeZero />
				{/if}
			</button>

			<div class="container-volume-slider">
				<input type="range" min="0" max="1" step="0.01" bind:value={$masterVolume} />
			</div>
		</div>

		<button on:click={handlePrev}>
			<ControlPrev />
		</button>
		<button on:click={playToggle}>
			{#if $isPlaying}
				<ControlPause />
			{:else}
				<ControlPlay />
			{/if}
		</button>

		<button on:click={handleNext}>
			<ControlNext />
		</button>

		<button on:click={handleReplay} class="replay" class:active={$replayMode !== 'off'}>
			<ControlReplay />
			{#if $replayMode !== 'off'}
				<div class="indicator">{$replayMode}</div>
			{/if}
		</button>
	</div>
</div>

<style lang="postcss">
	.container {
		background-color: #343434;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		padding: 0 10px;
		padding-bottom: 20px;

		display: flex;
		justify-content: center;
		align-items: center;

		position: fixed;
		bottom: 0;
		z-index: 100;

		border-top: 1px solid #1E1E1E;
	}

	@media only screen and (min-width: 400px) {
		.container {
			padding: 0px 40px;
		}
	}

	.control-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #d6d6d6;
		padding: 10px 0px;
		width: 100%;
		max-width: 720px;
	}
	.control-container:hover {
		color: white;
	}
	button {
		color: #d6d6d6;
		position: relative;
		width: 60px;
	}
	button:hover {
		color: white;
	}

	.replay.active {
		color: #4c7eff;
	}

	.indicator {
		position: absolute;
		left: 10px;
		bottom: -10px;
		z-index: 100;
		background-color: #4c7eff;
		padding: 2px 8px;
		height: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 10px;
		border-radius: 4px;
		color: white;
	}
	.volume-controls {
		display: flex;
		flex-direction: column;
		color: #ccc;
		position: relative;
	}
	.container-volume-slider {
		display: none;
		position: absolute;
		top: 40px;
		left: 20px;
		margin-top: 10px;
		width: 100px;
		/* border: 1px solid #ccc; */
	}

	@media only screen and (max-width: 400px) {
		.container-volume-slider {
			display: block;
		}
	}

	input {
		width: 100%;
	}
	.control-container:hover > .volume-controls > .container-volume-slider {
		display: block;
	}
</style>
