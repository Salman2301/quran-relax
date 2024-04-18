<script lang="ts">
	import { ArrowTurnDownLeftIcon, ArrowTurnDownRightIcon, CaretLeftIcon, CaretRightIcon } from 'svelte-uicons/rounded/regular';

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

	interface Ayah {
		line: string;
		surah_num: number;
		ayah_num: number;
		isNewSurah: boolean;
		translate: { language: string; id: string; surah: string }[];
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

	let ayahs: Ayah[] = [];
	let surahInfo: SurahInfo[] = [];

	onMount(async () => {
		setFromStore();
		const [surahInfoData, quranSimpleData, ...translation] = await Promise.all([
			fetch('/quran/surah-info.json').then((res) => res.json()),
			fetch('/quran/quran-simple.txt').then((res) => res.text()),
			fetch('/quran/trans/en.maududi.txt').then((res) => res.text()).then(line=>line.split("\n").map(line=>line.split("|")[2])),
			fetch('/quran/trans/ta.tamil.txt').then((res) => res.text()).then(line=>line.split("\n").map(line=>line.split("|")[2]))
		]);

		console.log({ translation })
		const quranData = quranSimpleData.split('\n').splice(0, 50000); // load only first 500 verse
		let currSurah = 0;
		ayahs = quranData.map((l, index) => {
			const [surah, ayah, line] = l.split('|');
			let isNewSurah = false;
			if (currSurah !== Number(surah)) {
				isNewSurah = true;
				currSurah = Number(surah);
			}
			return {
				line,
				translate: [
					{
						language: "en",
						id: "some-id",
						surah: translation[0][index]
					},
					{
						language: "en",
						id: "some-id",
						surah: translation[1][index]
					}
				],
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
	{#each ayahs as ayah}
		<div id="surah-{ayah.surah_num}"></div>
		{#if ayah.isNewSurah}
			{@const currSurahInfo = surahInfo[ayah.surah_num - 1]}
			{@const surahTitle = currSurahInfo.title}
			{@const surahMean = currSurahInfo.meaning.en}
			<div style="z-index:{100 + ayah.surah_num};" class="surah-header">
				{#if ayah.surah_num > 1}
					<a href="#surah-{ayah.surah_num - 1}" style="color:white">
						<CaretLeftIcon size="15" />
					</a>
				{/if}
				<h4 class="surah-title">
					{ayah.surah_num}{')'}
					{surahTitle} ( {surahMean} )
				</h4>

				{#if ayah.surah_num < 114}
					<a href="#surah-{ayah.surah_num + 1}" style="color:white">
						<CaretRightIcon size="16" />
					</a>
				{/if}
			</div>
		{/if}
		<h1 style="direction:rtl">
			<span class="ayah-num">{ayah.ayah_num}</span>
			<span class="verse">
				<p>{ayah.line}</p>
				{#each ayah.translate as currTranslate}
					<p class="verse-translation">
						<span><ArrowTurnDownLeftIcon size="14" /></span>
						{currTranslate.surah}
					</p>
				{/each}
			</span>
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
		margin-bottom: 10px;
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
	.ayah-num {
		font-size: max(calc(var(--theme-font-size) - 14px), 14px);
		color: var(--theme-font-color);
		opacity: 0.8;
		align-self: start;
		/* padding-top: 10px; */
		border: 1px solid var(--theme-font-color);
		border-radius: 100%;
		width: 30px;
		min-width: 30px;
		height: 30px;
		min-height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.verse {
		color: var(--theme-font-color);
		font-size: var(--theme-font-size);
		text-align: right;
		font-family: var(--theme-font-family);
	}
	.verse-translation {
		opacity: 0.8;
	}
</style>
