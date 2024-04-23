<script lang="ts">
	import { soundStore } from '$lib/stores/soundEffects.store';
	import { createEventDispatcher } from 'svelte';
	import { initSoundEffectsMixer } from '$lib/utils/soundEffectsMixer';
	import { isPlaying } from '$lib/stores/player.store';

	import type { SoundsData } from './data';

	export let data: SoundsData | null = null;
	// export let volume: number = 1;
	export let hover: boolean = false;

	const dispatch = createEventDispatcher();

	async function toggle() {
		if (!data) return;
		$soundStore[data.id].active = !$soundStore[data.id].active;
		(await initSoundEffectsMixer()).activateSoundEffect(
			data.id,
			$isPlaying && $soundStore[data.id].active
		);
	}

	function handleMouseEnter() {
		hover = true;
		dispatch('hover');
	}

	function handleMouseLeave() {
		hover = false;
	}

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="button-container">
	{#if data}
		<button
			class="button"
			class:active={$soundStore[data.id].active}
			on:click={toggle}
			on:mouseenter={handleMouseEnter}
		>
			<img src="/images/sounds/{data.id}.svg" alt="Play {data.name}" />
		</button>

		<div
			class="hover-container"
			class:hidden={!hover}
			class:left-shift={['wind', 'river', 'ocean'].includes(data.id)}
			on:mouseleave={handleMouseLeave}
		>
			<div class="header">
				<span>{data.id}</span>
				<button on:click={toggle} class:active={$soundStore[data.id].active}>
					{$soundStore[data.id].active ? 'DISABLE' : 'ENABLE'}
				</button>
			</div>
			<div class="name" class:active={$soundStore[data.id].active}>{data.name}</div>
			<div class="producer">
				<div></div>
				{data.producer}
			</div>

			<div class="sound-controls">
				<div class="volume-container">
					<div class="label">
						<span>Volume</span>
						<span class="control-value">{Math.round($soundStore[data.id].volume * 10000) / 100}%</span>
					</div>
					<input
						type="range"
						bind:value={$soundStore[data.id].volume}
						min="0"
						max="1"
						step="0.01"
						class="range-input"
					/>
				</div>
			</div>
		</div>
	{:else}
		<button class="button" />
	{/if}
</div>

<style lang="postcss">
	.button-container {
		position: relative;
	}
	.button {
		width: 50px;
		height: 50px;
		background-color: #343434;
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	img {
		width: 40px;
		height: 40px;
		scale: 0.8;
		/* border: 1px solid red; */
	}
	button.active {
		background-color: #4c7eff;
	}
	.hover-container {
		position: absolute;
		width: 270px;
		background-color: #1b1c21;
		border-color: 1px solid red;
		padding: 20px 10px;
		border-radius: 10px;
		margin-top: 10px;
		border: 1px solid white;
		box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
	}
	.left-shift {
		margin-left: -230px;
	}
	.hover-container.hidden {
		display: none;
	}
	.hover-container .header {
		text-transform: capitalize;
		font-size: 10px;
		font-weight: bold;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.header button {
		background-color: #4c7eff;
		color: white;
		font-size: 10px;
		/* width: 40px; */
		padding: 4px 8px;
		border-radius: 4px;
	}

	.header button.active {
		background-color: #ccc;
	}
	.name {
		color: #ccc;
		font-size: 18px;
		font-weight: semibold;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.name.active {
		color: #4c7eff;
	}
	.producer {
		font-size: 14px;
		font-weight: bold;
		text-align: right;

		display: flex;
		justify-content: end;
		gap: 4px;
		align-items: center;
		margin-bottom: 20px;
		color: #ccc;
	}
	.producer div {
		width: 16px;
		height: 1px;
		background-color: #ccc;
	}

	.range-input {
		width: 100%;
		border: 0px;
		outline: 0px;
	}
	.label {
		font-size: 16px;
		display: flex;
		justify-content: space-between;
		align-items: end;
	}
	.label span {
		font-size: 14px;
	}
	.control-value {
		font-size: 12px;
		font-weight: semibold;
	}
</style>
