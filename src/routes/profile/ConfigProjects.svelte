
<script>
    import { onMount } from "svelte";
	
	import { getMyProjects, newProject, deleteProject } from "$lib/database.js";
	import { addToast } from "$lib/util.js";
    import Modal from "$lib/svelte/Modal.svelte";

	let projects = [];

	async function loadProjects() {
		let projectsData = await getMyProjects();
		if (!projectsData.success)
			return addToast("Failed!", "Error: " + (projectsData.error ?? "no error"), "error");
		projects = projectsData.projects.sort((a, b) => {
			let tB = Math.max(b.date_updated, b.date_publish, b.date_added);
			let tA = Math.max(a.date_updated, a.date_publish, a.date_added);
			return tB - tA;
		});
	}

	let newProjectModal = false;
	let newProjectName = "";
	async function createNewProject() {
		newProjectModal = false;
		let data = await newProject(newProjectName);
		if (data.success) {
			loadProjects();
			let newProjectId = data.projectId;
			window.open(`/profile/edit/${newProjectId}`);
			await loadProfile();
			addToast("Created!", "Your new project has been created.", "success", 3);
		} else {
			addToast("Failed!", "Error: " + (data.error ?? "no error"), "error");
		}
	}

	let deleteProjectModal = false;
	let projectToDelete = 0;
	async function deleteProjectSubmit() {
		deleteProjectModal = false;
		await deleteProject(projectToDelete);
		await loadProjects();
		addToast("Deleted!", "Your project has been deleted.", "success", 3);
	}

	onMount(() => {
		loadProjects();
	});
</script>

<h2>
	Manage your projects
</h2>

<p>
	Create, delete or edit your projects. Projects are not visible to others by default.
</p>

<div class="ruler-text">
	<span>your projects</span>
</div>

<div class="projects-container">
	{#each projects as project}
		<div class="list-project">
			<div class="right-area">
				<div class="info-group">
					<span>{project.downloads} {project.downloads == 1 ? "download" : "downloads"}</span>
					<span>{project.views} {project.views == 1 ? "view" : "views"}</span>
					<span>{project.likes} {project.likes == 1 ? "like" : "likes"}</span>
				</div>

				<div class="button-group">
					<a href="/profile/edit/{project.id}" class="button"><i class="fa-solid fa-pencil"></i></a>
					<button class="button red" on:click|preventDefault={() => { projectToDelete = project.id; deleteProjectModal = true; }}><i class="fa-solid fa-trash-can"></i></button>
				</div>
			</div>

			<div>
				<span class="project-title">{project.name}</span>
				<i>{project.description_short ?? project.description}</i>
			</div>
		</div>
	{/each}
</div>

<button id="newProject" class="button" on:click={() => { newProjectModal = true; }}><i class="fa-solid fa-plus"></i> New project</button>

<Modal title="New project" bind:opened={newProjectModal}>
	<form class="model-form" on:submit|preventDefault={createNewProject}>
		<label for="newProjectName">Project name</label>
		<input id="newProjectName" type="text" placeholder="Project name" bind:value={newProjectName}>

		<button type="submit" class="button">Create</button>
	</form>
</Modal>

<Modal title="Delete project" bind:opened={deleteProjectModal}>
	<p>Are you sure you want to delete this project?</p>

	<form class="model-form" on:submit|preventDefault={deleteProjectSubmit}>
		<button type="submit" class="button red">Delete</button>
	</form>
</Modal>

<style>
	.projects-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.list-project {
		background-color: rgba(0, 0, 0, 0.2);
		padding: 1rem;
		border-radius: 1rem;
	}
	.list-project .project-title {
		font-size: 1.125rem;
		padding-right: 1rem;
	}
	.list-project > div > i {
		display: block;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: var(--text-color-medium);
		padding-right: 1rem;
	}
	.right-area {
		float: right;
		display: flex;
		gap: 1rem;
	}
	.info-group {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-align: right;
	}
	.info-group span {
		line-height: 1em;
		font-size: 0.75rem;
		color: var(--text-color-dark);
	}
	.button-group {
		display: flex;
		gap: 1rem;
	}
	@media screen and (max-width: 30rem) {
		.info-group {
			/* padding-block: 0.5rem; */
			justify-content: space-around;
		}
		.info-group span {
			/* font-size: 1rem; */
		}
		.button-group {
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	#newProject {
		margin: auto;
		display: block;
		margin-top: 2rem;
	}
</style>