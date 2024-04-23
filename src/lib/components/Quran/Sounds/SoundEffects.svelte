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

<div class="container">
	<div class="sound-effects-container" use:clickOutside on:outsideclick={hideAll}>
		{#each data as item}
			<SoundEffectsButton
				data={item}
				bind:hover={hoverSound[item.id]}
				on:hover={() => hideRest(item.id)}
			/>
		{/each}
	</div>
</div>

<style lang="postcss">
	.container {
		display: flex;
		justify-content: center;

		padding: 0 20px;
		width: 100vw;
	}
	

	@media only screen and (min-width: 400px) {
		.container {
			padding: 0px 40px;
		}
	}

	.sound-effects-container {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 4px;
		width: 100%;
		max-width: 720px;
	}
</style>
