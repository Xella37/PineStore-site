
<svelte:head>
	<title>Update project</title>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { BASE_URL, getProject, setProjectInfo, setProjectThumbnail, addProjectMedia, removeProjectMedia, publishProjectUpdate } from "$lib/database.js";
	import { getProjectLink, addToast } from "$lib/util.js";

	import Markdown from "$lib/Markdown.svelte";
    import Modal from "$lib/Modal.svelte";
    import CopyField from "$lib/CopyField.svelte";

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
		let projectData = await getProject(projectId, "SESSION");
		if (!projectData.success)
			return addToast("Failed!", "Failed to load project. Error: " + (projectData.error ?? "no error"), "error");

		savedProject = projectData.project;
		savedProject.selectedTags = savedProject.tags?.split(",") ?? [];
		project = {...savedProject};
	}

	async function saveProject() {
		let sendData = {...project};
		sendData.tags = project.selectedTags.join(",");
		console.log(sendData);
		let saveData = await setProjectInfo(sendData);
		unsavedChanges = false;
		savedProject = {...project};

		if (saveData.success)
			addToast("Saved!", "Your project has successfully been saved.", "success", 3);
		else
			addToast("Failed!", "Failed to save project. Error: " + (saveData.error ?? "no error"), "error");
	}

	async function viewProjectPage() {
		window.open(getProjectLink(project.id, savedProject.name), "_blank");
	}

	$: thumbnail_link = project.has_thumbnail ? `${BASE_URL}/project/${project.id}/thumbnail_full.webp?t=${Date.now()}` : "/project-placeholder.webp";
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
	function uploadImage(image) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = async e => {
				let imageData = e.target.result;

				try {
					await addProjectMedia(project.id, imageData);
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

	let changelogInput = "";
	let publishUpdateModal = false;
	async function publishUpdateSubmit() {
		publishUpdateModal = false;
		let res = await publishProjectUpdate(project.id, changelogInput);
		if (res.success)
			addToast("Update published!", "Your project has been updated.", "success", 3);
		else
			addToast("Failed!", "Failed to publish update. Error: " + (res.error ?? "no error"), "error");
	}

	let imageLinks = [];
	$: if (project.media_count != null) {
		imageLinks = [];
		for (let i = 0; i < project.media_count; i++) {
			imageLinks.push(`${BASE_URL}/project/${project.id}/image_${i}.webp?t=${Date.now()}`);
		}
	}

	$: badgeLink = `https://raster.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpinestore.cc%2Fapi%2Fproject%2F${encodeURIComponent(project?.id)}&query=%24.project.downloads&suffix=%20downloads&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzYuOTA0IiBoZWlnaHQ9Ijg5LjI5NSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc2OS4wNCA4OTIuOTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%2BCiA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNzQgLTQuNjgyNikiIGZpbGw9IiM5YWIyZjIiPgogIDxwYXRoIGQ9Im00MTAgODUxYzAtMTIgMjYtMjEgNTgtMjEgMTUgMCAyMiA0IDE3IDktMTQgMTItNzUgMjItNzUgMTJ6Ii8%2BCiAgPHBhdGggZD0ibTU4NSA3NDJjLTEtNDkgNC03MiAxNi04NSAyMi0yNCAzMC02OCAxNi04Ni0xMi0xNC0yNy0zOS00OC03OC0xMC0xOS05LTI2IDQtNDEgMjItMjQgMjEtNjctMi0xNDQtMjEtNjktMzktMTQ0LTQ4LTE5NS00LTI2LTItMzMgMTEtMzMgMzEgMCAxMTIgMzMgMTQxIDU4IDI4IDIzIDgxIDkyIDcxIDkyLTIgMCA1IDI2IDE2IDU3IDI4IDc5IDI5IDIyNCAzIDMwOC0xMCAzMy0xOSA2Mi0xOSA2NS00IDI2LTEzMiAxNTAtMTU1IDE1MC0zIDAtNi0zMC02LTY4eiIvPgogIDxwYXRoIGQ9Im02OCA2NzNjLTcyLTEwOS03MS0yNzggMy00MjMgMzYtNzEgNjItMTAwIDEyOC0xNDAgNDMtMjcgNjUtMzQgMTE4LTM2IDEwMC00IDk4IDExLTE5IDEzNi0zNCAzNy03OCA4OC05NiAxMTMtMjggMzktMzEgNDgtMjEgNjUgMTEgMTcgNiAyNy0zMyA3OS00MCA1My00NCA2Mi0zMiA3OCAxNyAyMyAxOCA1NyAyIDczLTYgNi0xNCAzMS0xNyA1NC02IDQyLTYgNDItMzMgMXoiLz4KIDwvZz4KIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNC43NCAtNC42ODI2KSIgZmlsbD0iIzU5YTY0ZiI%2BCiAgPHBhdGggZD0ibTM2NSA4MTNjLTUzLTYtMTM5LTMzLTE5Mi02MS02OC0zNS04My02Ny01OC0xMjIgMjYtNTkgNDAtNjcgNzgtNDkgNjggMzMgMTY3IDU4IDI2NiA2OSA1OCA1IDEwNiAxMiAxMDkgMTQgMiAzIDYgMzIgOSA2NSA4IDg1IDAgOTEtMTAxIDkwLTQ0LTEtOTQtNC0xMTEtNnoiLz4KICA8cGF0aCBkPSJtNDEwIDQ1OWMtNjctNy0xNjAtMjktMTk5LTQ4LTI3LTE0LTM0LTM2LTIwLTYzIDIxLTM4IDk3LTEzNiAxNTAtMTkzIDI1LTI3IDU4LTcxIDczLTk3IDI1LTQzIDMxLTQ3IDU0LTQyIDQwIDEwIDQyIDEyIDQyIDUyIDAgMjAgNiA1NyAxNCA4MiAyNCA3MyA1NCAxOTIgNjIgMjM2IDUgMzUgMyA0NS0xNSA2My0yMyAyMy0zNiAyNC0xNjEgMTB6Ii8%2BCiA8L2c%2BCiA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNzQgLTQuNjgyNikiIGZpbGw9IiM3ZWNiMjUiPgogIDxwYXRoIGQ9Im01NTggNjc0Yy0yLTItNTEtOS0xMDktMTQtMTAyLTExLTIwNC0zNy0yNjQtNjktMTYtOC0zMi0xNC0zNC0xMi00IDMtMzEtNDgtMzEtNjEgMC01IDIxLTMxIDQ2LTU4IDUxLTU0IDcxLTYwIDEzMC0zNSAxOSA4IDgzIDE5IDE0MiAyNSA1OCA2IDEwNyAxMiAxMDcgMTNzMTUgMjYgMzMgNTZjMjcgNDMgMzIgNjMgMzAgOTktMiAzNS04IDQ3LTI1IDUzLTExIDQtMjMgNi0yNSAzeiIvPgogPC9nPgogPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0Ljc0IC00LjY4MjYpIiBmaWxsPSIjZWNlZGVmIj4KICA8cGF0aCBkPSJtMjYwIDg5MGMtMzQtOC03MC00MS03MC02NSAwLTYtOS0yMC0yMC0zMHMtMjAtMjItMjAtMjctMTMtMjEtMzAtMzVjLTM1LTI5LTQxLTgzLTEzLTEyMiAxNS0yMiAxNS0yNi0xLTU2LTE4LTMzLTE4LTMzIDI3LTkxIDI4LTM2IDQyLTYzIDM2LTY4LTIzLTI1IDktNzggMTIwLTE5NyAzNi0zOCA3Mi04MSA4Mi05NiAxMC0xNCAyNS0zMCAzMy0zNSAzNi0yMCA3IDMyLTUzIDk3LTQ4IDUxLTEyNiAxNTAtMTQ5IDE4OS0xMCAxOC05IDI0IDEwIDQwIDIzIDE5IDIzIDE5LTI5IDcxLTUzIDUyLTUzIDUyLTM4IDgyIDE0IDI4IDE0IDMzLTEwIDc2LTMyIDU3LTIzIDgxIDQ2IDEyMCAzNCAxOSA0OSAzMyA0NSA0Mi0xNCAzNyAzNiA3NSA5OCA3NSAyNSAwIDQwLTcgNTQtMjUgMTgtMjMgMjctMjUgOTUtMjUgOTQgMCAxMDItOCA5My04OS02LTUzLTUtNTkgMTQtNjQgMzItOCAyNi02NC0xNS0xMzItMzUtNTgtMzUtNTgtOS04MiAyMS0xOSAyNC0yOSAxOS01Ni0xMC00Ny00NC0xNzUtNjEtMjI3LTgtMjUtMTQtNjItMTQtODMgMC0yNy01LTM5LTE3LTQzLTEwLTMtMjUtOC0zMy0xMC0xMi00LTEyLTYtMS0xNCAyNy0xNiA1NiA1IDY5IDUxIDM1IDExNyA0MyAxNDggNDYgMTcwIDIgMTMgMTEgNTEgMjEgODQgMjEgNzEgMjEgMTIxIDAgMTQ1LTE0IDE1LTEzIDE5IDUgNDMgMTEgMTQgMjAgMzAgMjAgMzVzNyAxNSAxNSAyMmMyMSAxNyAxNiA3NS0xMCAxMDItMTggMTktMjAgMzItMTcgNzkgNCA1MCAyIDU4LTE5IDcyLTEyIDktNTAgMTktODMgMjMtNDUgNS02NSAxMy04MyAzMi0yNiAyOC05MiAzOC0xNTMgMjJ6Ii8%2BCiA8L2c%2BCiA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNzQgLTQuNjgyNikiIGZpbGw9IiM3ZTY3NGQiPgogIDxwYXRoIGQ9Im0yNDggODU0Yy0zMC0xNi00Ny01OS0zMC03NiA4LTggMjMtNyA1NCAyIDI0IDcgNjEgMTQgODMgMTcgNTQgNyA1OSAxNSAzNSA0Ni0xOCAyMy0yOSAyNy02OCAyNy0yNi0xLTU5LTctNzQtMTZ6Ii8%2BCiA8L2c%2BCjwvc3ZnPgo%3D&label=PineStore`
	$: badgeLinkMarkdown = `[![Download on PineStore](${badgeLink})](${"https://pinestore.cc" + getProjectLink(project.id, savedProject.name ?? "untitled")})`;
	

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
				<button id="visibleInput" class="button green" on:click={() => { project.visible = true; }}>Publish project</button>
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
			<div class="flex-list">
				<div class="form-list">
					<label for="titleInput">Name</label>
					<input id="titleInput" type="text" bind:value={project.name} maxlength="40" placeholder="My Cool Project">

					{#if savedProject.visible}
						<button class="button green" on:click|preventDefault={() => { publishUpdateModal = true; }}>Publish update</button>
					{/if}
				</div>
				<div class="form-list">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Dynamic badge</label>
					<img src="{badgeLink}" alt="badge">

					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Markdown</label>
					<CopyField text={badgeLinkMarkdown} />

					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Image link</label>
					<CopyField text={badgeLink} />
				</div>
			</div>

			<div class="ruler-text">
				<span>basic info</span>
			</div>

				<div class="flex-list">
					<div class="form-list">
						<label for="installInput">Install command (for any program to install e.g. games, utility, operating systems)</label>
						<input id="installInput" type="text" bind:value={project.install_command} maxlength="150" placeholder="pastebin run ABC123">
					</div>
					
					<div class="form-list">
						<label for="targetInput">Target file (to run after installation, leave empty to hide from in-game stores)</label>
						<input id="targetInput" type="text" bind:value={project.target_file} maxlength="30" placeholder="program.lua">
					</div>
				</div>

				<div class="form-list">
					<label for="downloadInput">Download url (for e.g. mods, addons or resource packs, etc. ; Does not have to be a direct link)</label>
					<input id="downloadInput" type="text" bind:value={project.download_url} maxlength="150" placeholder="https://linktosite.cc/download.zip">
				</div>

				<label for="repoInput">Git repository</label>
				<input id="repoInput" type="text" bind:value={project.repository} maxlength="150" placeholder="https://github.com/username/repository">

				<label for="keywordsInput">Keywords used for search (comma separated)</label>
				<input id="keywordsInput" type="text" bind:value={project.keywords} maxlength="300" placeholder="example,keywords,go,here">

				<label for="tagsInput">Tags (preferrably 2-3)</label>
				<TagList hideSaved bind:selectedTags={project.selectedTags} />

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
								<Markdown source={project.description_markdown ?? ""} />
							</div>
						</div>
					</div>
				</div>

			<div class="ruler-text">
				<span>media</span>
			</div>
				<label for="hideThumbnail">Hide thumbnail on project page</label>
				<!-- <input id="hideThumbnail" type="checkbox" bind:checked={project.hide_thumbnail} /> -->
				<button id="hideThumbnail" class="toggle" style="font-size: 1.75rem;" class:enabled={project.hide_thumbnail} on:click|preventDefault={() => { project.hide_thumbnail = !project.hide_thumbnail; }} />

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

<Modal title="Publish update" bind:opened={publishUpdateModal}>
	<p>Are you sure you publish an update? This will update the date_edited value to the current time, allowing other software to know it has been updated recently.</p>
	<p>This will also send a notification to anyone who is following this project.</p>

	<form class="model-form" on:submit|preventDefault={publishUpdateSubmit}>
		<label for="changelogBody">Changelog</label>
		<textarea bind:value={changelogInput} id="changelogBody" placeholder="Briefly explain what has been added/updated regarding the project." maxlength="2450"></textarea>
		<button type="submit" style="width:100%;" class="button green">Publish update</button>
	</form>
</Modal>

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

	.form-list > label:first-child {
		margin-top: 0;
	}

	.form-list > * {
		display: block;
		margin-block: 1rem;
	}
	.form-list > label {
		margin-top: 2rem;
		color: var(--text-color-medium);
	}
	.form-list input[type="text"] {
		width: 100%;
		box-sizing: border-box;
	}

	.form-list input[type="checkbox"] {
		width: 1.5rem;
		height: 1.5rem;
	}

	.model-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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

	#visibleInput {
		min-width: 13rem;
	}

	.flex-list > * {
		min-width: 14rem!important;
	}
</style>