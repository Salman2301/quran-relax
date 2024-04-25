<script lang="ts">
	import { onMount } from 'svelte';
	import { currentSurahId, currentVerseId } from '$lib/stores/player.store';
	import { showSidebar } from '$sidebar/sidebar.store';
	import type { SurahInfo } from '$lib/constant/surah-map-info';

	export let item: SurahInfo;
	export let active: boolean = false;
	export let expand: boolean = active;
	let containerInstance: HTMLElement;

	let verses = new Array(item.count).fill('').map((_, i) => i + 1);

	onMount(() => {
		if ($currentSurahId > 1) {
			document.getElementById(`verse-item-${$currentSurahId}-${$currentVerseId}`)?.scrollIntoView({
				behavior: 'auto',
				block: 'center',
				inline: 'center'
			});
		}
	});
</script>

<div class="container" class:expand>
	<button class="item-container" on:click={() => (expand = !expand)}>
		<div class="surah-item-content">
			<span class="surah-item-title" class:active>
				{Number(item.index)} - {item.titleAr} ({item.title})
			</span>
			<span class="surah-item-count">{item.count} verses</span>
		</div>
	</button>

	{#if expand}
		{#each verses as verse}
			<button
				class="verse-item"
				class:active={Number(item.index) === $currentSurahId && verse === $currentVerseId}
				on:click={() => {
					$currentVerseId = verse;
					$currentSurahId = Number(item.index);
					$showSidebar = null;
				}}
				id="verse-item-{$currentSurahId}-{$currentVerseId}"
				bind:this={containerInstance}
			>
				Verse {verse}
			</button>
		{/each}
	{/if}
</div>

<style lang="postcss">
	.item-container {
		color: #ccc;
		/* width: 100%; */
		display: block;
		font-size: 16px;
		text-align: start;
		padding: 10px 10px;
		padding-left: 4px;

		/* margin-left: -20px; */
		width: 100%;

		display: flex;
		align-items: center;
		gap: 4px;
	}

	.item-container:hover {
		color: white;
	}

	.surah-item-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.surah-item-count {
		color: #949494;
		font-size: 12px;
	}
	.verse-item {
		font-size: 12px;
		color: #ccc;
		margin: 4px 0px;
		padding-left: 4px;
		padding: 4px 0px;

		display: block;
		width: 100%;
		text-align: left;
	}
	.verse-item.active {
		color: #4c7eff;
	}
	.container {
		background-color: #1b1c21;
		border-radius: 10px;
		padding-left: 10px;
		margin-bottom: 10px;
	}

	.container.expand {
		background-color: #101010;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.surah-item-title.active {
		color: #4c7eff;
	}
</style>
