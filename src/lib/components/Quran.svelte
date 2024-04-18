<script lang="ts">
	import { onMount } from 'svelte';
	import Setting from './Setting.svelte';

	interface Surah {
		line: string;
		surah: number;
		ayah: number;
		isNewSurah: boolean;
	}

	interface SurahInfo {
		place: string;
		type: string;
		count: number;
		title: string;
		titleAr: string;
		index: string;
		pages: string;
		juz: { index: string; verse: { start: string; end: string } }[];
		meaning: { ar: string; en: string; id: string };
		recitation: string;
	}

	let surahs: Surah[] = [];
	let surahInfo: SurahInfo[] = [];

	onMount(async () => {
		const [surahInfoData, quranData] = await Promise.all([
			fetch('/quran/surah-info.json').then((res) => res.json()),
			fetch('/quran/quran-simple.txt').then((res) => res.text())
		]);

		const translation = quranData.split('\n').splice(0, 500); // load only first 500 verse
		let currSurah = 0;
		surahs = translation.map((l) => {
			const [surah, ayah, line] = l.split('|');
			let isNewSurah = false;
			if (currSurah !== Number(surah)) {
				isNewSurah = true;
				currSurah = Number(surah);
			}
			return {
				line,
				surah: Number(surah),
				ayah: Number(ayah),
				isNewSurah
			};
		});
		surahInfo = surahInfoData;
	});
</script>

<Setting />

<div class="quran-container">
	{#each surahs as surah}
		{#if surah.isNewSurah}
			{@const currSurahInfo = surahInfo[surah.surah - 1]}
			{@const surahTitle = currSurahInfo.title}
			{@const surahMean = currSurahInfo.meaning.en}
			<div style="z-index:{100 + surah.surah};" class="surah-header">
				<h4 class="surah-title">
					{surah.surah}{')'}
					{surahTitle} ( {surahMean} )
				</h4>
			</div>
		{/if}
		<h1 style="direction:rtl">
			<span class="ayah">{surah.ayah}</span>
			<span class="verse">{surah.line}</span>
		</h1>
	{/each}
</div>

<style lang="postcss">
	.quran-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		background-color: #212121;
	}
	.surah-header {
		position: sticky;
		top: 0;
		background: #212121;
		width: 100%;
		height: 40px;
		text-align: center;
		border-bottom: 1px solid white;
	}
	.surah-title {
		color: white;
		font-size: 14px;
		margin: 0;
		padding-top: 10px;
	}
	/* hr {
		color: white;
		width: 100%;
	} */
	h1 {
		display: flex;
		align-items: center;
		justify-content: right;
		width: 100%;
		padding: 0 10px;
		gap: 4px;
	}
	.ayah {
		font-size: 14px;
		color: #666;
		align-self: flex-start;
		padding-top: 14px;
	}
	.verse {
		color: white;
		text-align: center;
	}
</style>
