<script lang="ts">
	import { showSidebar } from '$sidebar/sidebar.store';
</script>

<button class="overlay" on:click={() => ($showSidebar = null)}></button>

<div class="sidebar-container">
	<div class="scroll">
		<slot name="sidebar-content"></slot>
	</div>
</div>

<style lang="postcss">
	.overlay {
		background-color: black;
		opacity: 0.5;
		position: fixed;
		top: 0;
		width: 100vw;
		height: 100vh;
	}
	.sidebar-container {
		position: fixed;
		top: 0;
		right: 0px;
		min-width: 320px;
		max-width: 380px;
		height: 100vh;
		background-color: #1b1c21;
		z-index: 1000;
		border-left: 1px solid #2e3039;
		animation: slide 0.4s ease;
	}

	@keyframes slide {
		0% {
			right: -400px;
		}
		100% {
			right: 0;
		}
	}
	.scroll {
		overflow-y: auto;
		height: 100%;
		width: 100%;
		padding: 10px 20px;
	}
</style>
