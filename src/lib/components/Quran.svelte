<script lang="ts">
	import { CaretLeftIcon, CaretRightIcon } from 'svelte-uicons/rounded/regular';

	import { onMount } from 'svelte';
	import Setting from './Setting.svelte';
	import {
	setFromStore,
		themeBackgroundColor,
		themeFontColor,
		themeFontFamily,
		themeFontSize
	} from '$lib/stores/theme.store';
	import { obj2str } from '$lib/utils/obj';

	interface Surah {
		line: string;
		surah_num: number;
		ayah_num: number;
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
		setFromStore();
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
				surah_num: Number(surah),
				ayah_num: Number(ayah),
				isNewSurah
			};
		});
		surahInfo = surahInfoData;
	});
</script>

<Setting />

<div
	class="quran-container"
	style={obj2str({
		'--theme-background-color': $themeBackgroundColor,
		'--theme-font-color': $themeFontColor,
		'--theme-font-family': $themeFontFamily,
		'--theme-font-size': $themeFontSize
	})}
>
	{#each surahs as surah}
		<div id="surah-{surah.surah_num}"></div>
		{#if surah.isNewSurah}
			{@const currSurahInfo = surahInfo[surah.surah_num - 1]}
			{@const surahTitle = currSurahInfo.title}
			{@const surahMean = currSurahInfo.meaning.en}
			<div style="z-index:{100 + surah.surah_num};" class="surah-header">
				{#if surah.surah_num > 1}
					<a href="#surah-{surah.surah_num - 1}" style="color:white">
						<CaretLeftIcon size="15" />
					</a>
				{/if}
				<h4 class="surah-title">
					{surah.surah_num}{')'}
					{surahTitle} ( {surahMean} )
				</h4>

				{#if surah.surah_num <= 114}
					<a href="#surah-{surah.surah_num + 1}" style="color:white">
						<CaretRightIcon size="16" />
					</a>
				{/if}
			</div>
		{/if}
		<h1 style="direction:rtl">
			<span class="ayah">{surah.ayah_num}</span>
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
		background-color: var(--theme-background-color);
		font-family: var(--theme-font-family);
	}
	.surah-header {
		position: sticky;
		top: 0;
		background: var(--theme-background-color);
		width: 100%;
		height: 40px;
		text-align: center;
		border-bottom: 1px solid;
		border-bottom-color: var(--theme-font-color);
		display: flex;
		gap: 4px;
		justify-content: center;
		align-items: center;
	}
	.surah-title {
		color: var(--theme-font-color);
		margin: 0;
		font-family: var(--theme-font-family);
		/* padding-top: 10px; */
		width: 500px;
	}
	h1 {
		display: flex;
		align-items: center;
		justify-content: right;
		width: 100%;
		padding: 0 10px;
		gap: 4px;
	}
	.ayah {
		font-size: max(calc(var(--theme-font-size) - 14px), 10px);
		color: var(--theme-font-color);
		opacity: 0.8;
		align-self: center;
	}
	.verse {
		color: var(--theme-font-color);
		font-size: var(--theme-font-size);
		text-align: center;
		font-family: var(--theme-font-family);
	}
</style>
