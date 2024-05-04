<script lang="ts">;
	import Core from "$lib/components/Layout/Core.svelte";
	import Quran from '$lib/components/Quran/Quran.svelte';
  import { page } from '$app/stores';
  import { onMount } from "svelte"
	import { currentSurahId } from '$lib/stores/player.store';
  
  onMount(()=>{
    const { surah } = $page.params;
    if( typeof Number(surah) !== "number" ) return;
    $currentSurahId = Number(surah);
  });
</script>

<Core>
	<div slot="content">
		<Quran  />
	</div>
</Core>
