<script>
	import { BASE_URL, setProjectThumbnail, addProjectMedia, removeProjectMedia } from "$lib/database.js";
	import { addToast } from "$lib/util.js";

	export let project;

	$: thumbnail_link = project.has_thumbnail ? `${BASE_URL}/project/${project.id}/thumbnail_full.webp?t=${Date.now()}` : "/project-placeholder.webp";
	let thumbnailInput;
	let uploadingThumbnail = false;
	let isDraggingThumbnail = false; // Tracks drag state for styling

	function handleDragOverThumbnail(e) {
		e.preventDefault();
		isDraggingThumbnail = true;
	}

	function handleDragLeaveThumbnail(e) {
		e.preventDefault();
		isDraggingThumbnail = false;
	}

	function handleDropThumbnail(e) {
		e.preventDefault();
		isDraggingThumbnail = false;

		if (e.dataTransfer?.files?.length > 0) {
			// Pass synthetic event structure or extract files directly
			uploadThumbnail({ target: { files: e.dataTransfer.files } });
		}
	}
	async function uploadThumbnail(e) {
		uploadingThumbnail = true;
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = async e => {
			let imageData = e.target.result;

			try {
				await setProjectThumbnail(project.id, imageData);
				thumbnail_link = `${BASE_URL}/project/${project.id}/thumbnail_full.webp?t=${Date.now()}`;
				addToast("Saved!", "Thumbnail successfully uploaded.", "success", 3);
			} catch(e) {
				addToast("Failed!", "Error during thumbnail upload! File might be too large. If you think you should be able to upload this file, please contact Xella on Discord.", "error");
			}
			uploadingThumbnail = false;
		};
	}

	let newMediaInput;
	let uploadingNewMedia = false;
	let isDragging = false;

	function handleDragOver(e) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;

		if (e.dataTransfer?.files?.length > 0)
			uploadNewMedia({ target: { files: e.dataTransfer.files } });
	}

	function uploadImage(image) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = async e => {
				let imageData = e.target.result;

				try {
					let res = await addProjectMedia(project.id, imageData);
					console.log(res);
					addToast("Added!", "Media added to project.", "success", 3);
					project.media_count++;
				} catch(e) {
					addToast("Failed!", "Error during media upload! File might be too large. If you think you should be able to upload this file, please contact Xella on Discord.", "error");
				}
				resolve();
			};
		});
	}
	async function uploadNewMedia(e) {
		let images = e.target.files;

		uploadingNewMedia = true;
		for (const image of images) {
			await uploadImage(image);
		}
		uploadingNewMedia = false;
	}

	async function deleteMedia(index) {
		await removeProjectMedia(project.id, index);
		project.media_count--;
		addToast("Deleted!", "Media removed from project.", "success", 3);
	}

	let imageLinks = [];
	$: if (project.media_count != null) {
		imageLinks = [];
		for (let i = 0; i < project.media_count; i++) {
			imageLinks.push(`${BASE_URL}/project/${project.id}/image_${i}.webp?t=${Date.now()}`);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id="thumbnailArea"
	class:uploading={uploadingThumbnail}
	class:dragging={isDraggingThumbnail}
	on:dragover={handleDragOverThumbnail}
	on:dragleave={handleDragLeaveThumbnail}
	on:drop={handleDropThumbnail}
>
	<div class="thumbnail-container">
		<div class="drop-here">
			<i class="fa-solid fa-upload"></i>
			<span>Drop files here to upload.</span>
			<span>Any of: .png .jpeg .jpg .gif .webp</span>
		</div>

		<img src="{thumbnail_link}" id="thumbnailPreview" on:click={()=>{thumbnailInput.click();}} alt="preview">
		{#if uploadingThumbnail}
			<i class="loading-icon fa-solid fa-arrow-rotate-right"></i>
		{/if}
		<input id="thumbnailInput" style="display:none" type="file" accept=".jpg, .jpeg, .png, .webp, .gif" on:change={(e) => uploadThumbnail(e)} bind:this={thumbnailInput} >
	</div>

	<div class="thumbnail-display-config">	
		<button id="showThumbnail" class="toggle" style="font-size: 1.75rem;" class:enabled={!project.hide_thumbnail} on:click|preventDefault={() => { project.hide_thumbnail = !project.hide_thumbnail; }} />
		<label for="showThumbnail">Show thumbnail on page</label>
	</div>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
	id="mediaDragDrop" 
	class:dragging={isDragging}
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop={handleDrop}
>
	<div class="ruler-text">
		media list
	</div>

	<label for="newMediaInput">Also supports .gif, or animated .webp for better quality.</label>
	<div id="mediaContainer">
		<div class="drop-here">
			<i class="fa-solid fa-upload"></i>
			<span>Drop files here to upload.</span>
			<span>Any of: .png .jpeg .jpg .gif .webp</span>
		</div>

		<div id="mediaList">
			{#each imageLinks as url, i}
				<div style="position:relative;" class="media-item">
					<img src="{url}" alt="media">
					<button class="button red delete-button" on:click|preventDefault={() => {deleteMedia(i);}}>
						<i class="fa-solid fa-trash-can"></i>
					</button>
				</div>
			{/each}

			{#if imageLinks.length <= 0}
				<span class="empty-message">no media added yet</span>
			{/if}
		</div>
	</div>
	<button id="newMediaButton" class="button" on:click|preventDefault={()=>{newMediaInput.click();}}>
		{#if uploadingNewMedia}
			Uploading...
		{:else}
			<i class="fa-solid fa-upload"></i> Upload media
		{/if}
	</button>
	<input id="newMediaInput" style="display:none" type="file" accept=".jpg, .jpeg, .png, .webp, .gif" on:change={uploadNewMedia} bind:this={newMediaInput} multiple>
</div>

<style>
	#thumbnailPreview {
		display: relative;
		display: block;
		margin: auto;
		border-radius: 1rem;
		min-width: 10rem;
		max-width: 100%;
		max-height: 30rem;
		object-fit: contain;
		cursor: pointer;
		transition: all ease 100ms;
	}
	#thumbnailPreview:hover {
		filter: brightness(1.2);
	}
	#thumbnailArea {
		position: relative;
	}
	#thumbnailArea.dragging img {
		filter: brightness(0.8);
	}
	#thumbnailArea.uploading {
		pointer-events: none;
		cursor: default;
	}
	#thumbnailArea.uploading #thumbnailPreview {
		filter: brightness(0.5);
	}
	.thumbnail-container {
		position: relative;
	}
	@keyframes spinning {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	.loading-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		font-size: 2rem;
		transform: translate(-50%, -50%);
		animation: spinning linear 1000ms infinite;
	}

	.thumbnail-display-config {
		display: inline-flex;
		justify-content: left;
		margin-block: 1rem;
	}
	.thumbnail-display-config label {
		display: inline-block;
		margin: auto;
		margin-left: 1rem;
		cursor: pointer;
		color: var(--text-color-medium);
	}

	#mediaDragDrop {
		position: relative;
		margin-inline: -2rem;
		padding-inline: 2rem;
		padding-top: 0.5rem;
	}
	#mediaDragDrop.dragging #mediaList {
		filter: brightness(0.8);
	}
	#mediaDragDrop label {
		color: var(--text-color-medium);
	}
	.drop-here {
		position: absolute;
		top: 50%;
		left: 50%;
		box-sizing: border-box;
		background-color: var(--cc-gray);
		border: solid 0.25rem var(--cc-lightGray);
		border-style: dashed;
		z-index: 12;
		transform: translate(-50%, -50%);
		padding: 2rem;
		padding-left: 6rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 75%;
		max-width: 22rem;
		pointer-events: none;
		opacity: 0;
		transition: all ease 100ms;
	}
	.dragging .drop-here {
		opacity: 1;
	}
	.drop-here i {
		position: absolute;
		left: 2rem;
		top: 50%;
		font-size: 2rem;
		transform: translateY(-50%);
		color: var(--text-color-dark);
	}
	.drop-here span:first-of-type {
		font-size: 1.25rem;
	}
	.drop-here span:last-child {
		color: var(--text-color-medium)
	}

	#mediaContainer {
		position: relative;
		background-color: #222;
		height: 12rem;
		margin-block: 1rem;
		margin-inline: calc(0rem - var(--island-padding));
		transition: all ease 100ms;
	}
	#mediaList {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		gap: 1rem;
		flex-direction: row;
		padding: 1.5rem;
		overflow-x: auto;
	}
	.media-item {
		height: 100%;
	}
	.media-item img {
		height: 100%;
		border-radius: 1rem;
		object-fit: cover;
	}

	#newMediaButton {
		width: 100%;
	}
	.delete-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>