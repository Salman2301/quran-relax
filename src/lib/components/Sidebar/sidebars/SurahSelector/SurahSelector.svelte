<script lang="ts">
	import Sidebar from '../../Sidebar.svelte';
	import SurahSelectorItem from './SurahSelectorItem.svelte';
	import juzMapSurah from "$lib/constant/juz-map-surah";

	import { currentSurahId, currentVerseId } from '$lib/stores/player.store';
	import surahInfo, { type SurahInfo } from '$lib/constant/surah-map-info';
	import { writable, type Writable } from 'svelte/store';
	import { showSidebar } from '../../sidebar.store';

	let currentMode: 'surah' | 'juz' = 'juz';
	let keyword: Writable<string> = writable('');
		
	let allJuz: string[] = new Array(30).fill("").map((_,i)=>String(i+1));

	let filteredSurahInfo:SurahInfo[] = [...surahInfo];
	let filteredJuzInfo: string[] = [...allJuz];

	keyword.subscribe(($keyword) => {
		if (!$keyword) {
			filteredSurahInfo = [...surahInfo];
			filteredJuzInfo = [...allJuz];
			return;
		}
		$keyword = $keyword.toLowerCase();
		filteredSurahInfo = [
			...surahInfo.filter((item) => {
				return (
					item.index.includes($keyword) ||
					item.title.toLowerCase().includes($keyword) ||
					item.titleAr.toLowerCase().includes($keyword) ||
					item.meaning.en.toLowerCase().includes($keyword)
				);
			})
		];

		filteredJuzInfo = allJuz.filter((item)=>item.includes($keyword))
	});

	function handleJuzSelect(index: string) {
		const { surah, verse } = juzMapSurah[Number(index)-1].start;
		$currentSurahId = surah;
		$currentVerseId = verse;
		$showSidebar = null;
	}
</script>

<Sidebar>
	<div class="sidebar-content-container">
		<div class="surah-juz-selector">
			<button
				class="selector surah"
				class:active={currentMode === 'surah'}
				on:click={() => (currentMode = 'surah')}
			>
				Surah
			</button>
			<button
				class="selector juz"
				class:active={currentMode === 'juz'}
				on:click={() => (currentMode = 'juz')}
			>
				Juz
			</button>
		</div>
		<div class="search-container">
			<div class="input-container">
				<input bind:value={$keyword} placeholder="Search..." />
				<svg
					width="21"
					height="21"
					viewBox="0 0 21 21"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.78457 16.7274C13.0839 16.7274 16.5691 13.2067 16.5691 8.86368C16.5691 4.52069 13.0839 1 8.78457 1C4.48527 1 1 4.52069 1 8.86368C1 13.2067 4.48527 16.7274 8.78457 16.7274Z"
						stroke="#0F0F0F"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M19.8089 20L14.7504 14.8901"
						stroke="#0F0F0F"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
		{#if currentMode === 'surah'}
			{#each filteredSurahInfo as item}
				<SurahSelectorItem
					{item}
					active={$currentSurahId === Number(item.index)}
					expand={$currentSurahId === Number(item.index)}
				/>
			{/each}
		{:else if currentMode === "juz"}
			{#each filteredJuzInfo as item}
				<button
					class="juz-item"
					on:click={()=>handleJuzSelect(item)}	
				>
					Juz {item}
				</button>
			{/each}
		{/if}
	</div>
</Sidebar>

<style lang="postcss">
	.surah-juz-selector {
		display: flex;
		justify-content: center;
		margin: 10px 0px;
	}

	.selector {
		border: 1px solid #343434;
		padding: 6px 30px;
		/* background-color: #343434; */
		color: white;
		font-size: 12px;
	}

	.selector.active {
		background-color: #343434;
	}

	.surah {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}
	.juz {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	.input-container input {
		width: 100%;
		height: 40px;
		padding: 10px;
		background-color: color;
		outline: none;
		border: 1px solid #343434;
		color: #343434;

		border-radius: 6px;
		margin-bottom: 10px;
	}

	.input-container {
		position: relative;
	}

	.input-container svg {
		position: absolute;
		z-index: 100;
		right: 10px;
		top: 10px;
	}

	.juz-item {
		padding: 4px 0px;
		font-size: 14px;
		display: block;
		color: white;
	}
</style>
