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
	import { isMute, isPlaying, masterVolume, replayMode } from '$lib/stores/player.store';
	import { initMixer } from '$lib/utils/audio';


	function handlePrev() {}
	function handleNext() {}

	function handleReplay() {
		if ($replayMode == 'off') {
			$replayMode = 'surah';
		} else if ($replayMode == 'surah') {
			$replayMode = 'verse';
		} else {
			$replayMode = 'off';
		}
	}

	function handleToggleMute() {
		$isMute = !$isMute;
	}

	async function playToggle() {
		$isPlaying = !$isPlaying;
		(await initMixer()).setIsPlaying($isPlaying);
	}
</script>

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
		{#if !$isPlaying}
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

<style lang="postcss">
	.control-container {
		width: 580px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #d6d6d6;
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
  input {
    width: 100%;
  }
  .control-container:hover > .volume-controls > .container-volume-slider {
    display: block;
  }
</style>
