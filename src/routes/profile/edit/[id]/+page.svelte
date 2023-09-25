
<svelte:head>
	<title>Update project</title>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { getProject, setProjectInfo, setProjectThumbnail, addProjectMedia, removeProjectMedia } from "$lib/database.js";
	import { getProjectLink } from "$lib/util.js";

	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "$lib/MDImage.svelte";
	import MDCode from "$lib/MDCode.svelte";

	import { page } from "$app/stores";
	$: projectId = $page.params.id;

	import TagList from "../../../TagList.svelte";

	let savedProject = {
		description_markdown: "no markdown description",
	};
	let project = {};
	let unsavedChanges = false;
	let selectedDescription = "main";

	$: if (project) {
		let changes = false;
		for (const key of Object.keys(project)) {
			if (project[key] != savedProject[key]) {
				unsavedChanges = true;
				changes = true;
			}
		}
		if (!changes)
			unsavedChanges = false;
	}

	async function loadProject() {
		let projectData = await getProject(projectId);
		savedProject = projectData.project;
		savedProject.selectedTags = savedProject.tags?.split(",") ?? [];
		project = {...savedProject};
	}

	async function saveProject() {
		let sendData = {...project};
		sendData.tags = project.selectedTags.join(",");
		console.log(sendData);
		await setProjectInfo(sendData);
		unsavedChanges = false;
		savedProject = {...project};
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
			</button>
			<button on:click={() => { saveProject(); }} id="saveProject" class="button">
				<i class="fa-solid fa-floppy-disk"></i>
				Save project
			</button>
			{#if project.visible}
				<button id="visibleInput" class="button orange" on:click={() => { project.visible = false; }}>Hide project</button>
			{:else}
				<button id="visibleInput" class="button" on:click={() => { project.visible = true; }}>Publish project</button>
			{/if}
			<button on:click={() => { loadProject(); }} id="discardChanges" class="button red">
				<i class="fa-solid fa-rotate-left"></i>
				Revert
			</button>
		</div>

		{#if unsavedChanges}
			<div class="info-block warning">
				<i class="fa-solid fa-triangle-exclamation"></i>
				You have unsaved changes!
			</div>
		{:else}
			<div class="info-block no-icon">
				Be sure to save after making changes.
			</div>
		{/if}

		<form class="form-list">
			<label for="titleInput">Name</label>
			<input id="titleInput" type="text" bind:value={project.name} maxlength="40">

			<div class="ruler-text">
				<span>basic info</span>
			</div>

				<div class="flex-list">
					<div class="form-list">
						<label for="installInput">Install command</label>
						<input id="installInput" type="text" bind:value={project.install_command} maxlength="150">
					</div>
					
					<div class="form-list">
						<label for="targetInput">Target file (to run after installation)</label>
						<input id="targetInput" type="text" bind:value={project.target_file} maxlength="30">
					</div>
				</div>

				<label for="tagsInput">Tags (preferrably 2-3)</label>
				<!-- <input id="categoryInput" type="text" bind:value={project.category} maxlength="25"> -->
				<TagList bind:selectedTags={project.selectedTags} />

				<label for="repoInput">Git repository</label>
				<input id="repoInput" type="text" bind:value={project.repository} maxlength="150">

				<label for="keywordsInput">Keywords used for search (comma separated)</label>
				<input id="keywordsInput" type="text" bind:value={project.keywords} maxlength="300">

			<div class="ruler-text">
				<span>description</span>
			</div>

				<div class="flex-list">
					<button class="button tab" class:selected={selectedDescription == "short"} on:click|preventDefault={() => { selectedDescription = "short" }}>Short</button>
					<button class="button tab" class:selected={selectedDescription == "main"} on:click|preventDefault={() => { selectedDescription = "main" }}>Main</button>
					<button class="button tab" class:selected={selectedDescription == "markdown"} on:click|preventDefault={() => { selectedDescription = "markdown" }}>Markdown</button>
				</div>

				<div class="tab-container form-list" class:selected={selectedDescription == "short"}>
					<label for="descriptionShortInput">Description (short)</label>
					<textarea id="descriptionShortInput" type="text" bind:value={project.description_short} maxlength="200"></textarea>
				</div>

				<div class="tab-container form-list" class:selected={selectedDescription == "main"}>
					<label for="descriptionInput">Description</label>
					<textarea id="descriptionInput" type="text" bind:value={project.description} maxlength="3000"></textarea>
				</div>

				<div class="tab-container form-list" class:selected={selectedDescription == "markdown"}>
					<div class="flex-list">
						<div class="form-list markdown-input-section">
							<label for="descriptionMDInput">Description (markdown)</label>
							<textarea id="descriptionMDInput" bind:value={project.description_markdown} maxlength="3500"></textarea>
						</div>
						
						<div class="form-list">
							<label for="descriptionPreview">Preview</label>
							<div id="descriptionPreview" class="markdown-container">
								<SvelteMarkdown source={project.description_markdown ?? ""} renderers={{ image: MDImage, code: MDCode }} />
							</div>
						</div>
					</div>
				</div>

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
							<button class="button red delete-button" on:click|preventDefault={() => {deleteMedia(i);}}>
								<i class="fa-solid fa-trash-can"></i>
							</button>
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

	.form-list > * {
		display: block;
		margin-block: 1rem;
	}
	.form-list > label {
		margin-top: 2rem;
	}
	.form-list input[type="text"] {
		width: 100%;
		box-sizing: border-box;
	}

	#thumbnailPreview {
		display: relative;
		display: block;
		margin: auto;
		border-radius: 1rem;
		min-width: 10rem;
		max-width: 100%;
		max-height: 20rem;
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

	.tab {
		background-color: var(--cc-gray);
		color: white;
	}
	.tab.selected {
		background-color: var(--cc-blue);
	}
	.tab-container {
		display: none;
	}
	.tab-container.selected {
		display: block;
	}
	.tab-container textarea {
		min-height: 20rem;
	}

	.markdown-container {
		border: 1px solid var(--cc-lightGray);
		padding: 1rem;
	}

	.markdown-input-section {
		display: flex;
		flex-direction: column;
	}
	.markdown-input-section textarea {
		flex-grow: 1;
		margin-top: 0;
		font-size: 1rem;
	}
</style>