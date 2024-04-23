<script lang="ts">
	import { showSidebar } from '$lib/components/Sidebar/sidebar.store';
	import LoaderIcon from '$lib/icons/LoaderIcon.svelte';
	import {
		currentJuz,
		currentReciterName,
		currentSurahName,
		currentVerseAr,
		currentVerseId,
		currentVerseTr,
		isContentLoading
	} from '$lib/stores/player.store';
</script>

<div class="container">
	<div class="container-body">
		<div class="current-surah">
			<button on:click={() => ($showSidebar = 'surah-selector')}>
				<span class="surah-juz-title">
					{$currentSurahName} / {$currentJuz} Juz
				</span>
			</button>
			<span class="reciter-title">
				{#if $isContentLoading}
					<LoaderIcon />
				{:else}
					<div class="reciter">
						<button on:click={() => ($showSidebar = 'reciter')} class="reciter-btn">
							<div class="reciter-dash"></div>
							<span>{$currentReciterName}</span>
						</button>
					</div>
				{/if}
			</span>
		</div>
		<div class="verse">{$currentVerseAr}</div>
		<div class="translate">
			{#await $currentVerseTr then translated}
				<span>{$currentVerseId}.</span>
				<span style="text-transform:capitalize">
					{translated}
				</span>
			{/await}
		</div>
	</div>
</div>

<style lang="postcss">
	.container {
		background-color: #343434;
		border-radius: 8px;
		width: 100vw;

		min-height: 350px;
		max-width: 720px;
		margin: 0px 20px;
		padding: 10px 20px;
		padding-bottom: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	@media only screen and (min-width: 400px) {
		.container {
			margin: 0px 40px;
		}
	}

	.reciter {
		display: flex;
		justify-content: end;
	}
	.reciter button {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 4px;
		color: #ccc;
	}
	.reciter-dash {
		width: 18px;
		height: 2px;
		background-color: #ccc;
	}

	.reciter:hover {
		color: white;
	}

	.current-surah {
		font-size: 14px;
		font-weight: semibold;
		color: #ccc;
		margin-top: 10px;
		height: 30px;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.surah-juz-title {
		color: white;
	}
	.surah-juz-title:hover {
		color: #4c7eff;
	}

	@media only screen and (max-width: 400px) {
		.current-surah {
			flex-direction: column;
		}

		.surah-juz-title {
			align-self: flex-start;
		}
		.reciter-title {
			align-self: flex-end;
		}
	}
	.reciter-btn:hover > .reciter-dash {
		background-color: #4c7eff;
	}
	.reciter-btn:hover > span {
		color: #4c7eff;
	}
	.verse {
		text-align: center;
		font-size: 32px;
		/* font-family: "Amiri Quran"; */
		/* font-family: "Noto Sans Arabic"; */
		/* font-family: "Mirza"; */
		font-family: 'Rubik', serif;
		margin: 30px 0;
	}

	@media only screen and (min-width: 400px) {
		.verse {
			font-size: 48px;
		}
		.translate {
			font-weight: 200;
			font-size: 22px;
		}
	}

	.translate {
		font-weight: 200;
		font-size: 16px;
		text-align: center;
		margin: 10px 0px;
	}
	/* .next-verse {
		text-align: center;
		font-size: 13px;
		font-weight: 300;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	} */
</style>
