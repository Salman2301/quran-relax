<script lang="ts">
	import { clickOutside } from '$lib/action/clickOutside';
	import SoundEffectsButton from './SoundEffectsButton.svelte';
	import data from './data';

	const hoverSound: Record<string, boolean> = {
		rain: false,
		wind: false,
		thunder: false,
		campfire: false,
		river: false,
		ocean: false
	};

	function hideAll() {
		for (const [currId, v] of Object.entries(hoverSound)) {
			hoverSound[currId] = false;
		}
	}

	function hideRest(id: string) {
		for (const [currId, v] of Object.entries(hoverSound)) {
			if (currId !== id) {
				hoverSound[currId] = false;
			}
		}
	}
</script>

<div class="sound-effects-container" use:clickOutside on:outsideclick={hideAll}>
	{#each data as item}
		<SoundEffectsButton
			data={item}
			bind:hover={hoverSound[item.id]}
			on:hover={() => hideRest(item.id)}
		/>
	{/each}
</div>

<style lang="postcss">
	.sound-effects-container {
		display: flex;
		justify-content: space-evenly;
	}
</style>
