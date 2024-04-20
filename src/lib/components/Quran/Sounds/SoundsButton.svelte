<script lang="ts">
	import { soundStore } from '$lib/stores/sound.store';
	import { createEventDispatcher } from 'svelte';
	import SoundControls from '$lib/components/SoundControls/SoundControls.svelte';

	import type { SoundsData } from './data';

	export let data: SoundsData | null = null;
	export let hover: boolean = false;

	const dispatch = createEventDispatcher();

	function toggle() {
		if (!data) return;
		$soundStore[data.id].active = !$soundStore[data.id].active;
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
			<img src="/sounds/{data.id}.svg" alt="Play {data.name}" />
		</button>

		<div
			class="hover-container"
			class:hidden={!hover}
			class:left-shift={['wind', 'river', 'ocean'].includes(data.id)}
			on:mouseleave={handleMouseLeave}
		>
			<div class="id">{data.id}</div>
			<div
				class="name"
				class:active={$soundStore[data.id].active}
			>{data.name}</div>
			<div class="producer"><div></div>{data.producer}</div>
			<SoundControls
				volume={$soundStore[data.id].volume}
				speed={$soundStore[data.id].speed}
				reverb={$soundStore[data.id].reverb}
			/>
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
		width: 40px;
		height: 40px;
		background-color: #343434;
		border-radius: 100%;
		display: flex;
	}
	img {
		width: 40px;
		height: 40px;
		scale: 0.6;
	}
	button.active {
		background-color: #4c7eff;
	}
	.hover-container {
		position: absolute;
		width: 270px;
		background-color: #343434;
		border-color: 1px solid red;
		padding: 20px 10px;
		border-radius: 10px;
		margin-top: 10px;
	}
	.left-shift {
		margin-left: -230px;
	}
	.hover-container.hidden {
		display: none;
	}
	.hover-container .id {
		text-transform: capitalize;
		font-size: 10px;
		font-weight: bold;
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
		gap:4px;
		align-items: center;
		margin-bottom: 20px;
	}
	.producer div {
		width: 16px;
		height: 1px;
		background-color: white;
	} 
</style>
