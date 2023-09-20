
<svelte:head>
	<title>Update project</title>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { getProject, setProjectInfo } from "$lib/database.js";
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

				<label for="thumbnailInput">Thumbnail link (png recommended)</label>
				<input id="thumbnailInput" type="text" bind:value={project.thumbnail_link} maxlength="150">

				<label for="screenshotsInput">Screenshot links (comma separated)</label>
				<input id="screenshotsInput" type="text" bind:value={project.screenshot_links} maxlength="1000">
		</form>
	</div>
</div>

<style>
	.corner-buttons {
		float: right;
		display: flex;
		gap: 1rem;
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
</style>