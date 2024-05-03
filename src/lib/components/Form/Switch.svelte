<script lang="ts">
	export let checked: boolean = false;
</script>

<input type="checkbox" id="switch" bind:checked />
<label for="switch">Toggle</label>

<style lang="postcss">
	input[type='checkbox'] {
		height: 0;
		width: 0;
		visibility: hidden;
	}

	label {
		cursor: pointer;
		text-indent: -9999px;
		width: 40px;
		height: 20px;
		background: grey;
		display: block;
		border-radius: 100px;
		position: relative;
	}

	label:after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 14px;
		height: 14px;
		background: #fff;
		border-radius: 90px;
		transition: 0.3s;
	}

	input:checked + label {
		background: #4c7eff;
	}

	input:checked + label:after {
		left: calc(100% - 5px);
		transform: translateX(-100%);
	}

	label:active:after {
		width: 24px;
	}
</style>
