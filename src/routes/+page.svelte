<script lang="ts">
	import Quran from '$lib/components/Quran/Quran.svelte';
	import Reciters from '$lib/components/Sidebar/sidebars/Reciters/Reciters.svelte';

	import { showSidebar } from '$lib/components/Sidebar/sidebar.store';
	import { initQuranMixer } from '$lib/utils/quranMixer';
	import { initSoundEffectsMixer } from '$lib/utils/soundEffectsMixer';
	import {
	currentRecitationUrl,
		isMute,
		isPlaying,
		setNextSurah,
		setNextVerse,
		setPrevSurah,
		setPrevVerse,
		setUrlFromId,
		toggleReplay
	} from '$lib/stores/player.store';

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') $showSidebar = null;
		
		if (event.key.toLowerCase() === 'n') {
			if( event.shiftKey ) setNextSurah();
			else setNextVerse()
		}
		if (event.key.toLowerCase() === 'p') {
			if( event.shiftKey ) setPrevSurah();
			else setPrevVerse();
		}
		
		if (event.key.toLowerCase() === 'r') toggleReplay();
		if (event.key.toLowerCase() === 'm') $isMute = !$isMute;

		if (event.code === 'Space') {
			$isPlaying = !$isPlaying;
			event.preventDefault();
		}
	}

	async function playOnClick() {
		$isPlaying = true;

		initSoundEffectsMixer();
		const quranMixer = await initQuranMixer();
		quranMixer?.resume();
		// setUrlFromId();
		$currentRecitationUrl && quranMixer?.play($currentRecitationUrl);
	}
</script>

<svelte:document on:click|once={playOnClick} />

<Quran />
{#if $showSidebar === 'reciter'}
	<Reciters />
{/if}

<svelte:window on:keydown={handleKeydown} />
