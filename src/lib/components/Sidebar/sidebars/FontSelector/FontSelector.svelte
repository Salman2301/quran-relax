<script lang="ts">
	import Sidebar from '$sidebar/Sidebar.svelte';
	import FontSize from './FontSize.svelte';
	import LoaderIcon from '$lib/icons/LoaderIcon.svelte';

	import { showSidebar } from '$sidebar/sidebar.store';
	import { onMount } from 'svelte';
	import { currentArFontFamily, currentArFontSize, currentTrFontSize, currentTranslationId } from '$lib/stores/player.store';

	interface TranslationObj {
		id: string;
		lang: string;
		name: string;
		tran: string;
		dl: string;
	}

	let optionPromise: Promise<{ label: string; value: string }[]> = Promise.resolve([]);
  
	onMount(() => {
		optionPromise = fetch('/quran/trans/index.json')
			.then((res) => res.json())
			.then((json: TranslationObj[]) => {
				const opts = json.map((item) => ({
					label: `${item.lang} - ${item.name}` as string,
					value: item.id as string
				}));
				console.log({ opts });
				return opts;
			})
			.catch((err) => {
				console.error(err);
				return [];
			});
	});
</script>

<Sidebar>
	<h4>
		<span>Fonts Setting</span>
		<button on:click={() => ($showSidebar = null)}>
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M20 1L1 20" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M1 1L20 20" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</h4>

	<div class="content-body">
		<div class="container-body">
			<div class="header">Arabic font</div>
			<div class="font-family">
				<label for="arabic-font-family"> Arabic font family </label>
				<select
          id="arabic-font-family"
          bind:value={$currentArFontFamily}
        >
					<option value="Amiri Quran">Amiri Quran</option>
					<option value="Noto Sans Arabic">Noto Sans Arabic</option>
					<option value="Lateef">Lateef</option>
					<option value="Mirza">Mirza</option>
					<option value="Rubik">Rubik</option>
				</select>
			</div>
			<FontSize 
        bind:value={$currentArFontSize}
      />
			<div class="header">Translation font</div>

			<div class="font-family">
				{#await optionPromise}
					<LoaderIcon />
				{:then options}
					<select
            class="drop-translation"
            bind:value={$currentTranslationId}
          >
            {#each options as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
				{/await}
			</div>
			<FontSize
        bind:value={$currentTrFontSize}
      />
			<div class="actions">
				<button class="btn-action" on:click={()=>$showSidebar="reciter"}>Open Reciter setting</button>
				<button class="btn-action" on:click={()=>$showSidebar="surah-selector"}>Go to Surah / Verse</button>
			</div>
		</div>
	</div>
</Sidebar>

<style lang="postcss">
	h4 {
		font-size: 20px;
		font-weight: 200;
		margin-top: 10px;
		margin-bottom: 20px;
		text-align: center;
		color: #ccc;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header {
		font-size: 22px;
		font-weight: semibold;
		margin-top: 10px;
	}
	.font-family {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

  .drop-translation {
    width: 100%;
    height: 40px;
    padding-left: 10px;
  }

	.container-body {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	select {
		width: 110px;
		border-radius: 4px;
	}
	.actions {
		margin-top: 50px;
	}
	.btn-action {
		width: 100%;
		background-color: #ccc;
		color: black;
		height: 40px;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.btn-action:hover {
		background-color: #333;
		color: white;
	}
</style>
