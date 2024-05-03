<script lang="ts">
	import Switch from "../Form/Switch.svelte";

  export let volume:number = 0.5;
  export let speed:number = 1;
  export let useReverb: boolean = false;

</script>

<div class="sound-controls">
  <div class="volume-container">
    <div class="label">
      <span>Volume</span>
      <span class="control-value">{Math.round(volume*10000)/100}%</span>
    </div>
    <input type="range" bind:value={volume} min="0" max="1" step="0.01" />
  </div>
  <div class="speed-container">
    <div class="label">
      <span>Speed</span>
      <span class="control-value">{speed}x</span>
    </div>
    <input type="range" bind:value={speed} step="0.125" min="0.125" max="2" />
  </div>
  <div class="reverb-container">
    <div class="label">
      <span>Reverb</span>
    </div> 
    <Switch bind:checked={useReverb} />
  </div>
  
</div>

<style lang="postcss">
  input {
		width: 100%;
    border: 0px;
    outline: 0px;
	}
  .label {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
  .label span {
    font-size: 14px;
  }
  .control-value {
    font-size: 12px;
    font-weight: semibold;
  }
  .reverb-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 18px;
    margin-bottom: 28px;
  }
</style>
