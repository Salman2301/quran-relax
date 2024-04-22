<script lang="ts">
	import Sounds from './Sounds/SoundEffects.svelte';
	import Player from './Player/Player.svelte';
	import PlayerControls from './PlayerControls/PlayerControls.svelte';
</script>

<div class="container">
	<div class="container-top">
		<div class="sound-container">
			<Sounds />
		</div>
		<div class="player-container">
			<Player />
		</div>
	</div>
	<div class="player-control-container">
		<PlayerControls />
	</div>
</div>

<style lang="postcss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}

	.container-top {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	.sound-container {
		margin: 30px 0px;
	}
	.player-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.player-control-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
</style>
