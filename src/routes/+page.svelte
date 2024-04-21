<script lang="ts">
	import Quran from '$lib/components/Quran/Quran.svelte';
	import Reciters from '$lib/components/Sidebar/sidebars/Reciters/Reciters.svelte';

	import { showSidebar } from '$lib/components/Sidebar/sidebar.store';
	import { initQuranMixer } from '$lib/utils/quranMixer';
	import { initSoundEffectsMixer } from '$lib/utils/soundEffectsMixer';
	import { onMount } from 'svelte';

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			$showSidebar = null;
		}
	}

	onMount(()=>{
		initSoundEffectsMixer();
		initQuranMixer();
	});
</script>

<Quran />
{#if $showSidebar === 'reciter'}
	<Reciters />
{/if}
<svelte:window on:keydown={handleKeydown} />
