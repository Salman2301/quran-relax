<script lang="ts">
	export let label: string = 'Font size';
	export let value: number = 14;
</script>

<div class="font-selector">
	<div class="label">{label}</div>
	<div class="input-container">
		<button
      class="btn btn-left"
      on:click={()=>value+=2}
    >
      +
    </button>
    <div class="input-el">
      <input bind:value />
      <span>px</span>
    </div>
		<button
      class="btn btn-right"
      on:click={()=>value-=2}
    >
      -
    </button>
	</div>
</div>

<style lang="postcss">
  .font-selector {
    display: flex;
    justify-content: space-between;
  }
  button {
    color: white;
    background-color: #333;
    height: 30px;
    width: 30px;
    font-size: 18px;
  }

  .btn-right {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .btn-left {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  input {
    width: 44px;
    height: 30px;
    text-align: center;
    font-size: 14px;
    padding-right: 20px;
    padding-left: 4px;

    font-size: 14px;
  }

  .input-container {
    display: flex;
  }
  .input-el {
    position: relative;
  }
  span {
    position: absolute;
    color: #333;
    margin-left: -20px;
    font-size: 12px;
    margin-top: 6px;
  }

</style>
