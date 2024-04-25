<script lang="ts">
	import Reciters from '$lib/components/Sidebar/sidebars/Reciters/Reciters.svelte';
	import SurahSelector from '$lib/components/Sidebar/sidebars/SurahSelector/SurahSelector.svelte';
	import FontSelector from '$lib/components/Sidebar/sidebars/FontSelector/FontSelector.svelte';

	import { showSidebar } from '$lib/components/Sidebar/sidebar.store';
	import { initQuranMixer } from '$lib/utils/quranMixer';
	import { initSoundEffectsMixer } from '$lib/utils/soundEffectsMixer';
	import {
		currentRecitationUrl,
		isMute,
		isPlaying,
		// setFromLocalStorage,
		setNextSurah,
		setNextVerse,
		setPrevSurah,
		setPrevVerse,
		toggleReplay
	} from '$lib/stores/player.store';
	import { onMount } from 'svelte';
	import { getSoundStoreFromLocal } from '$lib/stores/soundEffects.store';

	let userClicked: boolean = false;
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') $showSidebar = null;

		if (event.key.toLowerCase() === 'n') {
			if (event.shiftKey) setNextSurah();
			else setNextVerse();
		}
		if (event.key.toLowerCase() === 'p') {
			if (event.shiftKey) setPrevSurah();
			else setPrevVerse();
		}

		if (event.key.toLowerCase() === 'r') {
			if( !event.metaKey ) toggleReplay();
		}
		if (event.key.toLowerCase() === 'm') $isMute = !$isMute;

		if (event.code === 'Space') {
			$isPlaying = !$isPlaying;
			event.preventDefault();
		}
	}

	onMount(() => {
		// getSoundStoreFromLocal();
	});

	async function playOnClick() {
		$isPlaying = true;
		initSoundEffectsMixer();
		userClicked = true;
		const quranMixer = await initQuranMixer();
		quranMixer?.resume();
		$currentRecitationUrl && quranMixer?.play($currentRecitationUrl);
	}

</script>

{#if !userClicked}
	<div class="no-audio-permission">
		Click anywhere to play the audio
	</div>
{/if}
<slot></slot>

{#if $showSidebar === 'reciter'}
	<Reciters />
{:else if $showSidebar === 'surah-selector'}
	<SurahSelector />
{:else if $showSidebar === 'font'}
	<FontSelector />
{/if}

<svelte:window on:keydown={handleKeydown} />
<svelte:document on:click|once={playOnClick} />

<style lang="postcss">
	.no-audio-permission {
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: rgb(226, 38, 0);
		color: white;
		height: 40px;
	}
</style>
