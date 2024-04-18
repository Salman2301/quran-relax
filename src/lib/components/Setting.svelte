<script lang="ts">
	import {
		themeBackgroundColor,
		themeFontColor,
		themeFontFamily,
		themeFontSize
	} from '$lib/stores/theme.store';
	import { SettingsIcon, SettingsSlidersIcon, XIcon } from 'svelte-uicons/rounded/regular';

	let showPopup: boolean = false;

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') showPopup = false;
	}
	function handleOpen() {
		showPopup = true;
	}
	function handleClose() {
		showPopup = false;
	}
</script>

<div class="pos-bottom">
	<div class="container">
		<button on:click={handleOpen} type="button" class="icon-btn">
			<SettingsSlidersIcon size="28"/>
		</button>
	</div>
</div>

{#if showPopup}
	<div class="overlay">
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<h3>Settings</h3>
					<button class="close-btn" on:click={handleClose}>
						<XIcon size="21"/>
					</button>
				</div>

				<div class="popup-body">
					<div class="section section-theme">
						<div class="section-header">
							<div class="section-item">
								<div class="section-label section-header">Theme</div>
								<div class="section-value">
									<select>
										<option value="default">Default</option>
									</select>
								</div>
							</div>
						</div>
						<div class="section-body">
							<div class="section-item">
								<div class="section-label">Font family</div>
								<div class="section-value">
									<select bind:value={$themeFontFamily}>
										<option value="cursive">Cursive</option>
										<option value="fantasy">Fantasy</option>
										<option value="sans-serif">Sans-serif </option>
										<option value="monospace">Monospace</option>
									</select>
								</div>
							</div>
							<div class="section-item">
								<div class="section-label">Font size</div>
								<div class="section-value">
									<select bind:value={$themeFontSize}>
										<option value="12px">12px</option>
										<option value="14px">14px</option>
										<option value="16px">16px</option>
										<option value="17px">17px</option>
										<option value="18px">18px</option>
										<option value="19px">19px</option>
										<option value="20px">20px</option>
										<option value="21px">21px</option>
										<option value="22px">22px</option>
										<option value="23px">23px</option>
										<option value="24px">24px</option>
										<option value="25px">25px</option>
										<option value="26px">26px</option>
										<option value="27px">27px</option>
										<option value="28px">28px</option>
										<option value="30px">30px</option>
										<option value="32px">32px</option>
										<option value="34px">34px</option>
										<option value="36px">36px</option>
										<option value="42px">42px</option>
										<option value="54px">54px</option>
										<option value="72px">72px</option>
									</select>
								</div>
							</div>
							<div class="section-item">
								<div class="section-label">Font color</div>
								<div class="section-value"><input type="color" bind:value={$themeFontColor} /></div>
							</div>
							<div class="section-item">
								<div class="section-label">Background color</div>
								<div class="section-value">
									<input type="color" bind:value={$themeBackgroundColor} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<svelte:window on:keydown={handleKeyDown} />

<style lang="postcss">
	.pos-bottom {
		position: fixed;
		bottom: 10px;
		left: 10px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: flex-end;
	}
	.container {
		display: flex;
		/* background-color: #212121; */
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.popup {
		background-color: #212121;
		border-radius: 10px;
		max-width: 500px;
		min-width: 500px;
		min-height: 500px;
	}
	.popup-content {
		padding: 10px;
	}
	.popup-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.popup-header > h3 {
		color: white;
		font-size: 18px;
		margin: 0;
		text-align: center;
		width: 100%;
	}
	.close-btn {
		background-color: transparent;
		border: none;
		outline: none;
		color: white;
	}
	.section {
		width: 100%;
		padding: 10px;
		border-radius: 10px;
		background-color: rgb(39, 39, 39);
		margin-top: 20px;
	}
	.section-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10px 0;
	}
	.section-label {
		color: white;
		font-size: 14px;
		margin: 0;
	}
	.section-header {
		color: white;
		font-size: 16px;
		margin: 0;
	}
	.icon-btn {
		background-color: aliceblue;
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}
</style>
