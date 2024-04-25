<script lang="ts">
	import Quran from '$lib/components/Quran/Quran.svelte';
  import { page } from '$app/stores';
  import { onMount } from "svelte"
	import { currentSurahId, currentVerseId } from '$lib/stores/player.store';
  
  onMount(()=>{
    const { surah, verse } = $page.params;
    if( typeof Number(verse) !== "number" ) return;
    $currentVerseId = Number(verse);
    $currentSurahId = Number(surah);
  });
</script>

<Quran />
