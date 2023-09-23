
<svelte:head>
	<title>Update project</title>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { getProject, setProjectInfo, setProjectThumbnail, addProjectMedia, removeProjectMedia } from "$lib/database.js";
	import { getProjectLink } from "$lib/util.js";

	import { page } from "$app/stores";
	$: projectId = $page.params.id;

	import TagList from "../../../TagList.svelte";

	let project = {}

	async function loadProject() {
		let projectData = await getProject(projectId);
		project = projectData.project;
		project.selectedTags = project.tags?.split(",") ?? [];
	}

	async function saveProject() {
		let sendData = {...project};
		sendData.tags = project.selectedTags.join(",");
		console.log(sendData);
		await setProjectInfo(sendData);
	}

	async function viewProjectPage() {
		window.open(getProjectLink(project.id, project.name), "_blank");
	}

	$: thumbnail_link = project.has_thumbnail ? `https://pinestore.cc/project/${project.id}/thumbnail_full.webp?t=${Date.now()}` : "/project-placeholder.webp";
	let thumbnailInput;
	let uploadingThumbnail = false;
	async function uploadThumbnail(e) {
		uploadingThumbnail = true;
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = async e => {
			let imageData = e.target.result;
			console.log(imageData);

			try {
				await setProjectThumbnail(project.id, imageData);
				thumbnail_link = `https://pinestore.cc/project/${project.id}/thumbnail_full.webp?t=${Date.now()}`;
			} catch(e) {
				alert("Error during thumbnail upload! File might be too large. If you think you should be able to upload this file, please contact Xella on Discord.");
			}
			uploadingThumbnail = false;
		};
	}

	let newMediaInput;
	let uploadingNewMedia = false;
	function uploadImage(image) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = async e => {
				let imageData = e.target.result;

				try {
					await addProjectMedia(project.id, imageData);
					project.media_count++;
				} catch(e) {
					alert("Error during thumbnail upload! File might be too large. If you think you should be able to upload this file, please contact Xella on Discord.");
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
	}

	let imageLinks = [];
	$: if (project.media_count != null) {
		imageLinks = [];
		for (let i = 0; i < project.media_count; i++) {
			imageLinks.push(`https://pinestore.cc/project/${project.id}/image_${i}.webp?t=${Date.now()}`);
		}
	}

	onMount(loadProject);
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="corner-buttons">
			<button on:click={() => { viewProjectPage(); }} id="viewProjectPage" class="button">
				<i class="fa-solid fa-arrow-up-right-from-square"></i>
				View page
			</button><button on:click={() => { saveProject(); }} id="saveProject" class="button">
				<i class="fa-solid fa-floppy-disk"></i>
				Save project
			</button>
			<button on:click={() => { loadProject(); }} id="discardChanges" class="button red">
				<i class="fa-solid fa-rotate-left"></i>
				Revert
			</button>
		</div>
		<form>
			<label for="titleInput">Name</label>
			<input id="titleInput" type="text" bind:value={project.name} maxlength="40">

			<div class="ruler-text">
				<span>basic info</span>
			</div>
				<label for="visibleInput">Project visible</label>
				<input id="visibleInput" type="checkbox" bind:checked={project.visible}>

				<label for="installInput">Install command</label>
				<input id="installInput" type="text" bind:value={project.install_command} maxlength="150">

				<label for="targetInput">Target file (to run after installation)</label>
				<input id="targetInput" type="text" bind:value={project.target_file} maxlength="30">

				<label for="tagsInput">Tags</label>
				<!-- <input id="categoryInput" type="text" bind:value={project.category} maxlength="25"> -->
				<TagList bind:selectedTags={project.selectedTags} />

				<label for="repoInput">Repository</label>
				<input id="repoInput" type="text" bind:value={project.repository} maxlength="150">

				<label for="keywordsInput">Keywords (comma separated)</label>
				<input id="keywordsInput" type="text" bind:value={project.keywords} maxlength="300">

			<div class="ruler-text">
				<span>description</span>
			</div>

				<label for="descriptionShortInput">Description (short)</label>
				<textarea id="descriptionShortInput" type="text" bind:value={project.description_short} maxlength="200"></textarea>

				<label for="descriptionInput">Description</label>
				<textarea id="descriptionInput" type="text" bind:value={project.description} maxlength="3000"></textarea>

				<label for="descriptionMDInput">Description (markdown)</label>
				<textarea id="descriptionMDInput" type="text" bind:value={project.description_markdown} maxlength="3500"></textarea>

			<div class="ruler-text">
				<span>media</span>
			</div>

				<label for="thumbnailInput">Thumbnail (instantly saved)</label>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<div id="thumbnailContainer">
					<img src="{thumbnail_link}" id="thumbnailPreview" on:click={()=>{thumbnailInput.click();}} alt="preview" class:uploading={uploadingThumbnail}>
					{#if uploadingThumbnail}
						<i class="loading-icon fa-solid fa-arrow-rotate-right"></i>
					{/if}
					<input id="thumbnailInput" style="display:none" type="file" accept=".jpg, .jpeg, .png, .webp, .gif" on:change={(e) => uploadThumbnail(e)} bind:this={thumbnailInput} >
				</div>

				<label for="newMediaInput">Media list</label>
				<div id="mediaContainer">
					{#each imageLinks as url, i}
						<div style="position:relative;" class="media-item">
							<img src="{url}" alt="media">
							<button class="button red delete-button" on:click|preventDefault={() => {deleteMedia(i);}}>Delete</button>
						</div>
					{/each}
				</div>
				<button id="newMediaButton" class="button" on:click|preventDefault={()=>{newMediaInput.click();}}>
					{#if uploadingNewMedia}
						Uploading...
					{:else}
						Upload
					{/if}
				</button>
				<input id="newMediaInput" style="display:none" type="file" accept=".jpg, .jpeg, .png, .webp, .gif" on:change={(e) => uploadNewMedia(e)} bind:this={newMediaInput} multiple>
		</form>
	</div>
</div>

<style>
	.corner-buttons {
		float: right;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.corner-buttons > * {
		flex-grow: 1;
	}
	@media screen and (max-width: 40rem) {
		.corner-buttons {
			width: 100%;
		}
		.corner-buttons > * {
			width: 100%;
		}
	}

	form > * {
		display: block;
		margin-block: 1rem;
	}

	input[type="checkbox"] {
		width: 1.5rem;
		height: 1.5rem;
		border: none;
	}

	#thumbnailPreview {
		display: relative;
		display: block;
		margin: auto;
		border-radius: 1rem;
		min-width: 10rem;
		max-width: 100%;
		height: 20rem;
		object-fit: contain;
		cursor: pointer;
	}
	#thumbnailPreview.uploading {
		filter: brightness(0.5);
	}
	#thumbnailContainer {
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

	#mediaContainer {
		display: flex;
		gap: 1rem;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}
	.media-item {
		width: calc(50% - 0.5rem);
	}
	.media-item img {
		width: 100%;
		border-radius: 1rem;
		object-fit: cover;
	}

	#newMediaButton {
		margin: auto;
	}
	.delete-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>