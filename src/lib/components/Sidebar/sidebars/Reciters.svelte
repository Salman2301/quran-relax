<script lang="ts">
	import SoundControls from '$lib/components/SoundControls/SoundControls.svelte';
	import { currentRecitationId, currentReciter } from '$lib/stores/reciter.store';
	import { onMount } from 'svelte';
	import Sidebar from '../Sidebar.svelte';
	import { showSidebar } from '../sidebar.store';

	export const data = [
		{
			name: 'AbdulBaset AbdulSamad',
			reciter_id: 'abdulsamad',
			mode: ['murattal', 'mujawwad'],
			murattal_id: 2,
			mujawwad_id: 1,
			muallim_id: null
		},
		{
			name: 'Abdur-Rahman as-Sudais',
			reciter_id: 'as-sudais',
			mode: ['murattal'],
			murattal_id: 3,
			mujawwad_id: null,
			muallim_id: null
		},
		{
			name: 'Abu Bakr al-Shatri',
			reciter_id: 'al-shatri',
			mode: ['murattal'],
			murattal_id: 4,
			mujawwad_id: null,
			muallim_id: null
		},
		{
			name: 'Hani ar-Rifai',
			reciter_id: 'ar-rifai',
			mode: ['murattal'],
			murattal_id: 5,
			mujawwad_id: null,
			muallim_id: null
		},
		{
			name: 'Mahmoud Khalil Al-Husary',
			reciter_id: 'al-husary',
			mode: ['murattal', 'muallim'],
			murattal_id: 6,
			mujawwad_id: null,
			muallim_id: 12
		},
		{
			name: 'Mishari Rashid al-`Afasy',
			reciter_id: 'al-afasy',
			mode: ['murattal'],
			murattal_id: 7,
			mujawwad_id: null,
			muallim_id: null
		},
		{
			name: 'Mohamed Siddiq al-Minshawi',
			reciter_id: 'al-minshawi',
			mode: ['murattal', 'mujawwad'],
			murattal_id: 9,
			mujawwad_id: 8,
			muallim_id: null
		},
		{
			name: 'Sa`ud ash-Shuraym',
			reciter_id: 'ash-shuraym',
			mode: ['murattal'],
			murattal_id: 10,
			mujawwad_id: null,
			muallim_id: null
		},
		{
			name: 'Mohamed al-Tablawi',
			reciter_id: 'al-tablawi',
			mode: ['mujawwad'],
			murattal_id: null,
			mujawwad_id: 11,
			muallim_id: null
		}
	];

	interface Option {
		recitation_id: number;
		reciter_mode: string;
	}

	let modes: Option[] = [];
	function selectReciter(reciter_id: string) {
		$currentReciter = reciter_id;
		for (const item of data) {
			if (item.reciter_id === reciter_id) {
				modes = item.mode.map((mode) => ({
					// @ts-ignore
					recitation_id: item[mode + '_id'],
					reciter_mode: mode
				}));

				$currentRecitationId = modes[0].recitation_id;
				break;
			}
		}
	}

	onMount(() => {
		selectReciter($currentReciter);
	});
</script>

<Sidebar>
	<h4>
		<span>Recitation setting</span>
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
	<SoundControls />
	<div class="label">
		<span>Reciters</span>
		<span>
			<select bind:value={$currentRecitationId}>
				{#each modes as mode}
					<option value={mode.recitation_id}>{mode.reciter_mode}</option>
				{/each}
			</select>
		</span>
	</div>
	<div class="images">
		{#each data as item}
			<button on:click={() => selectReciter(item.reciter_id)}>
				<img
					src="/reciters/{item.reciter_id}.png"
					alt="quran reciter {item.name}"
					class:active={$currentReciter === item.reciter_id}
				/>
				<p class:active={$currentReciter === item.reciter_id}>{item.name}</p>
			</button>
		{/each}
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
	button {
		color: white;
		font-weight: bold;
		/* height: 190px; */
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.images {
		display: flex;
		gap: 4px;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.label {
		font-size: 14px;
		font-weight: bold;
		margin-top: 10px;
		margin-bottom: 10px;

		display: flex;
		justify-content: space-between;
	}
	p {
		width: 90px;
		font-size: 10px;
		font-weight: normal;
	}
	p.active {
		color: #4c7eff;
	}
	img {
		width: 90px;
		height: 110px;
		border-radius: 8px;
		object-fit: cover;
	}
	img.active {
		outline: 3px solid #4c7eff;
	}

	select {
		text-transform: capitalize;
	}
</style>
