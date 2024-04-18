<script lang="ts">
	let showPopup: boolean = true;

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') showPopup = false;
	}
</script>

<div class="pos-bottom">
	<div class="container">
		<button on:click={() => (showPopup = true)} type="button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 48 48"
				fill="none"
			>
				<g clip-path="url(#clip0_281_38)">
					<circle cx="24" cy="24" r="24" fill="#D9D9D9" />
					<path
						d="M34.5228 28.152H26.8323C26.4109 28.152 26.0693 27.8105 26.0693 27.389C26.0693 26.9676 26.4109 26.626 26.8323 26.626H34.5225C34.944 26.626 35.2855 26.9676 35.2855 27.389C35.2855 27.8105 34.9442 28.152 34.5228 28.152Z"
						fill="black"
					/>
					<path
						d="M24.9826 30.0017C23.5421 30.0017 22.3701 28.8298 22.3701 27.3892C22.3701 25.9484 23.5421 24.7765 24.9826 24.7765C26.4234 24.7765 27.5953 25.9484 27.5953 27.3892C27.5953 28.8295 26.4234 30.0017 24.9826 30.0017ZM24.9826 26.3022C24.3834 26.3022 23.8961 26.7898 23.8961 27.389C23.8961 27.9879 24.3837 28.4755 24.9826 28.4755C25.5818 28.4755 26.0694 27.9879 26.0694 27.389C26.0694 26.7898 25.5818 26.3022 24.9826 26.3022Z"
						fill="black"
					/>
					<path
						d="M23.1328 28.152H13.763C13.3416 28.152 13 27.8105 13 27.389C13 26.9676 13.3416 26.626 13.763 26.626H23.133C23.5545 26.626 23.896 26.9676 23.896 27.389C23.896 27.8105 23.5542 28.152 23.1328 28.152Z"
						fill="black"
					/>
					<path
						d="M34.5228 22.2638H19.825C19.4036 22.2638 19.062 21.9222 19.062 21.5008C19.062 21.0794 19.4036 20.7378 19.825 20.7378H34.5228C34.9442 20.7378 35.2858 21.0794 35.2858 21.5008C35.2858 21.9222 34.9442 22.2638 34.5228 22.2638Z"
						fill="black"
					/>
					<path
						d="M17.975 24.1135C16.5343 24.1135 15.3623 22.9415 15.3623 21.5007C15.3623 20.06 16.5343 18.888 17.975 18.888C19.4158 18.888 20.5878 20.06 20.5878 21.5007C20.5878 22.9415 19.4156 24.1135 17.975 24.1135ZM17.975 20.414C17.3758 20.414 16.8883 20.9015 16.8883 21.5007C16.8883 22.0999 17.3758 22.5875 17.975 22.5875C18.5742 22.5875 19.0618 22.0999 19.0618 21.5007C19.0618 20.9015 18.574 20.414 17.975 20.414Z"
						fill="black"
					/>
					<path
						d="M16.1255 22.2638H13.763C13.3416 22.2638 13 21.9222 13 21.5008C13 21.0794 13.3416 20.7378 13.763 20.7378H16.1255C16.5469 20.7378 16.8885 21.0794 16.8885 21.5008C16.8885 21.9222 16.5466 22.2638 16.1255 22.2638Z"
						fill="black"
					/>
					<path
						d="M27.3567 16.3758H13.763C13.3416 16.3758 13 16.0342 13 15.6128C13 15.1914 13.3416 14.8498 13.763 14.8498H27.3567C27.7781 14.8498 28.1197 15.1914 28.1197 15.6128C28.1197 16.0342 27.7781 16.3758 27.3567 16.3758Z"
						fill="black"
					/>
					<path
						d="M29.2057 18.2255C27.7652 18.2255 26.5933 17.0535 26.5933 15.6127C26.5933 14.172 27.7652 13 29.2057 13C30.6465 13 31.8185 14.172 31.8185 15.6127C31.8185 17.0535 30.6465 18.2255 29.2057 18.2255ZM29.2057 14.526C28.6068 14.526 28.1192 15.0135 28.1192 15.6127C28.1192 16.2119 28.6068 16.6995 29.2057 16.6995C29.8049 16.6995 30.2925 16.2119 30.2925 15.6127C30.2925 15.0135 29.8052 14.526 29.2057 14.526Z"
						fill="black"
					/>
					<path
						d="M34.5225 16.3758H31.056C30.6345 16.3758 30.293 16.0342 30.293 15.6128C30.293 15.1914 30.6345 14.8498 31.056 14.8498H34.5225C34.9439 14.8498 35.2855 15.1914 35.2855 15.6128C35.2855 16.0342 34.9439 16.3758 34.5225 16.3758Z"
						fill="black"
					/>
					<path
						d="M34.5228 34.0403H19.825C19.4036 34.0403 19.062 33.6987 19.062 33.2773C19.062 32.8558 19.4036 32.5143 19.825 32.5143H34.5228C34.9442 32.5143 35.2858 32.8558 35.2858 33.2773C35.2858 33.6987 34.9442 34.0403 34.5228 34.0403Z"
						fill="black"
					/>
					<path
						d="M17.975 35.8898C16.5343 35.8898 15.3623 34.7178 15.3623 33.2773C15.3623 31.8365 16.5343 30.6646 17.975 30.6646C19.4158 30.6646 20.5878 31.8365 20.5878 33.2773C20.5875 34.7178 19.4156 35.8898 17.975 35.8898ZM17.975 32.1903C17.3758 32.1903 16.8883 32.6778 16.8883 33.277C16.8883 33.876 17.3758 34.3635 17.975 34.3635C18.5742 34.3635 19.0618 33.876 19.0618 33.277C19.0615 32.6778 18.574 32.1903 17.975 32.1903Z"
						fill="black"
					/>
					<path
						d="M16.1255 34.0403H13.763C13.3416 34.0403 13 33.6987 13 33.2773C13 32.8558 13.3416 32.5143 13.763 32.5143H16.1255C16.5469 32.5143 16.8885 32.8558 16.8885 33.2773C16.8885 33.6987 16.5466 34.0403 16.1255 34.0403Z"
						fill="black"
					/>
				</g>
				<defs>
					<clipPath id="clip0_281_38">
						<rect width="48" height="48" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</button>
	</div>
</div>

{#if showPopup}
	<div class="overlay">
		<div class="popup">
			<div class="popup-content">
				<div class="popup-header">
					<h3>Settings</h3>
					<button class="close-btn" on:click={() => (showPopup = false)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="21"
							height="21"
							viewBox="0 0 21 21"
							fill="none"
						>
							<path
								d="M3.24193 2.63818L2.63818 3.24193L9.89631 10.5001L2.63818 17.7582L3.24193 18.3619L10.5001 11.1038L17.7582 18.3619L18.3619 17.7582L11.1038 10.5001L18.3619 3.24193L17.7582 2.63818L10.5001 9.89631L3.24193 2.63818Z"
								fill="white"
							/>
						</svg>
					</button>
				</div>

				<div class="popup-body">
					<div class="section section-theme">
						<div class="section-header">
							<div class="section-item">
								<div class="section-label section-header">Theme</div>
								<div class="section-value">
									<select>
										<option value="default"> Default </option>
									</select>
								</div>
							</div>
						</div>
						<div class="section-body">
							<div class="section-item">
								<div class="section-label">Font family</div>
								<div class="section-value">
									<select>
										<option value="cursive"> Cursive </option>
									</select>
								</div>
							</div>
							<div class="section-item">
								<div class="section-label">Font size</div>
								<div class="section-value">
									<select>
										<option value="12"> 12px </option>
										<option value="14"> 14px </option>
										<option value="16"> 16px </option>
										<option value="17"> 17px </option>
										<option value="18"> 18px </option>
										<option value="19"> 19px </option>
										<option value="20"> 20px </option>
										<option value="21"> 21px </option>
										<option value="22"> 22px </option>
										<option value="23"> 23px </option>
										<option value="24"> 24px </option>
										<option value="25"> 25px </option>
										<option value="26"> 26px </option>
										<option value="27"> 27px </option>
										<option value="28"> 28px </option>
										<option value="30"> 30px </option>
										<option value="32"> 32px </option>
										<option value="34"> 34px </option>
										<option value="36"> 36px </option>
										<option value="42"> 42px </option>
										<option value="54"> 54px </option>
										<option value="72"> 72px </option>
									</select>
								</div>
							</div>
							<div class="section-item">
								<div class="section-label">Font color</div>
								<div class="section-value"><input type="color" /></div>
							</div>
							<div class="section-item">
								<div class="section-label">Background color</div>
								<div class="section-value"><input type="color" /></div>
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
</style>
