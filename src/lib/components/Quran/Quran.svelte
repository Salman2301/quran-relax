<script lang="ts">
  import Sounds from "./Sounds/Sounds.svelte";
  import Player from "./Player/Player.svelte";
  import PlayerControls from "./PlayerControls/PlayerControls.svelte";
</script>

<div class="container">
  <div class="sound-container">
    <Sounds />
  </div>
  <Player />
  <PlayerControls />
</div>

<style lang="postcss">
  .container {
    display: flex;
    flex-direction: column;
  }
  .sound-container {
    margin: 30px 0px;
  }
</style>