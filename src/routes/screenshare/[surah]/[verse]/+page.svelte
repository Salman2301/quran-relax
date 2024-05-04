<script lang="ts">
	import Player from '$lib/components/Quran/Player/Player.svelte';
	import Core from '$lib/components/Layout/Core.svelte';
	import { soundStore } from '$lib/stores/soundEffects.store';
	import {
  	currentArFontFamily,
		currentArFontSize,
		currentRecitationId,
		currentReciter,
		currentReciterReverb,
		currentReciterSpeed,
		currentReciterVolume,
		currentTrFontSize,
		currentTranslationId,
		currentVerseAr,
		isMute,
		masterVolume,
		replayMode,
	} from '$lib/stores/player.store';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { currentSurahId, currentVerseId } from '$lib/stores/player.store';

	const fontSizes = [
		{ maxChars: 100, size: 42 },
		{ maxChars: 180, size: 48 },
		{ maxChars: 280, size: 36 },
		{ maxChars: 680, size: 32 },
		{ maxChars: Infinity, size: 24 }
	];
	const fontSizesTr = [
		{ maxChars: 680, size: 22 },
		{ maxChars: Infinity, size: 12 }
	];

	currentVerseAr.subscribe(($currentVerseAr) => {
		const len = $currentVerseAr && $currentVerseAr.length;
		if (typeof len === 'undefined' || len === '') return;

		for (const item of fontSizes) {
			if (item.maxChars > len) {
				$currentArFontSize = item.size;
				break;
			}
		}
		for (const item of fontSizesTr) {
			if (item.maxChars > len) {
				$currentTrFontSize = item.size;
				break;
			}
		}

	});
	onMount(() => {
		const { surah, verse } = $page.params;
		if (typeof Number(verse) !== 'number') return;
		$currentVerseId = Number(verse);
		$currentSurahId = Number(surah);

		$currentArFontFamily = 'Rubik';
		$currentRecitationId = 7;
		$currentReciter = 'al-afasy';
		$currentReciterReverb = 5;
		$currentReciterSpeed = 1;
		$currentReciterVolume = 0.30 ;
	  $currentTranslationId = 'en.mubarakpuri';
		$isMute = false;
		$masterVolume = 1;
		$replayMode = 'off';
		$soundStore = {
			rain: {
				id: 'rain',
				active: true,
				volume: 1
			},
			thunder: {
				id: 'thunder',
				active: true,
				volume: 1
			},
			bird: {
				id: 'bird',
				active: true,
				volume: 1
			},
			campfire: {
				id: 'campfire',
				active: true,
				volume: 1
			},
			wind: {
				id: 'wind',
				active: true,
				volume: 1
			},
			river: {
				id: 'river',
				active: true,
				volume: 1
			},
			ocean: {
				id: 'ocean',
				active: true,
				volume: 1
			}
		};


    document.body.click();
	});

</script>

<Core>
	<div class="page" slot="content">
		<Player takeFullWidth={true} />
    <div class="footer">
      <div class="footer-container">
        <p>https://quran-relax.vercel.app</p>
      </div>
    </div>
	</div>

</Core>

<style lang="postcss">
	:global(body) {
		background-image: url('/images/bg/bg.png') !important;
		background-size: cover !important;
	}

	* > :global(.bg-container) {
		background-color: rgba(0, 0, 0, 0.9);
	}

	.page {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;
	}

  .footer {
    position: absolute;
    bottom:10;
    z-index: 100;
    height: 100vh;
  }
  .footer-container {

    background-color: rgba(0,0,0,0.4);
    /* height: 40px; */
    width: 100vw;
  }
  .footer-container p {
    color: white;
    font-size: 22px;
    padding: 10px;
    text-decoration: underline;
    text-align: center;
  }
</style>
