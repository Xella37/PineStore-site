
<svelte:head>
	<title>Discord Auth</title>
</svelte:head>

<script>
	import { error } from "@sveltejs/kit";
	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "$lib/MDImage.svelte";
	import MDCode from "$lib/MDCode.svelte";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { logoutUser, getMyProjects, getMyProfile, newProject, setProfileInfo, deleteProject, getUserOptions, setUserOptions } from "$lib/database.js";

	let profile = {
		name: "loading...",
		joined_on: 0,
		about: "loading...",
		about_markdown: "loading...",
	}
	let projects = [];
	let editingProfile = false;

	function logout() {
		logoutUser();
	}

	async function loadProjects() {
		let projectsData = await getMyProjects();
		if (!projectsData.success)
			throw error(404, projectsData.error);
		projects = projectsData.projects;
	}

	async function loadProfile() {
		let profileData = await getMyProfile();
		if (!profileData.success)
			throw error(404, profileData.error);
		profile = profileData.user;
	}

	async function saveProfile() {
		await setProfileInfo(profile);
	}

	let newProjectModal = false;
	let newProjectName = "";
	async function createNewProject(e) {
		e.preventDefault();

		newProjectModal = false;
		let data = await newProject(newProjectName);
		if (data.success) {
			let newProjectId = data.projectId;
			window.open(`/profile/edit/${newProjectId}`);
			await loadProfile();
		} else {
			alert(data.error);
		}
	}

	let deleteProjectModal = false;
	let projectToDelete = 0;
	async function deleteProjectSubmit(e) {
		e.preventDefault();

		deleteProjectModal = false;
		await deleteProject(projectToDelete);
		await loadProjects();
	}

	let options = {};
	async function sendUserOptions(e) {
		setUserOptions(options);
	}

	async function loadOptions() {
		let optionsData = await getUserOptions();
		options = optionsData.options;
	}

	onMount(() => {
		loadProfile();
		loadProjects();
		loadOptions();
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="corner-buttons">
			{#if !editingProfile}
				<button on:click={() => { editingProfile = true; }} id="editProfile" class="button">
					<i class="fa-solid fa-pencil"></i>
					Edit profile
				</button>
			{:else}
				<button on:click={() => { editingProfile = false; saveProfile(); }} id="saveProfile" class="button">
					<i class="fa-solid fa-floppy-disk"></i>
					Save profile
				</button>
				<button on:click={() => { editingProfile = false; loadProfile(); }} id="discardChanges" class="button red">
					<i class="fa-solid fa-trash-can"></i>
					Discard changes
				</button>
			{/if}
			<button on:click={logout} class="button">
				<i class="fa-solid fa-right-from-bracket"></i>
				Logout
			</button>
		</div>

		{#if !editingProfile}
			<h1>{profile.name}'s profile</h1>
			
			<p id="about" class="markdown-container">
				{#if profile.about_markdown}
					<SvelteMarkdown source={profile.about_markdown} renderers={{ image: MDImage, code: MDCode }} />
				{:else if profile.about}
					<SvelteMarkdown source={profile.about} renderers={{ image: MDImage, code: MDCode }} />
				{:else}
					<SvelteMarkdown source={"No about info..."} renderers={{ image: MDImage, code: MDCode }} />
				{/if}
			</p>
		{:else}
			<form>
				<label for="nameInput">Display name</label>
				<input id="nameInput" type="text" bind:value={profile.name}>

				<label for="aboutInput">About (plaintext)</label>
				<textarea id="aboutInput" type="text" bind:value={profile.about}></textarea>

				<label for="aboutMDInput">About (markdown)</label>
				<textarea id="aboutMDInput" type="text" bind:value={profile.about_markdown}></textarea>
			</form>
		{/if}

		<div class="ruler-text">
			<span>user options</span>
		</div>

		<form>
			<label for="discordNotificationsButton">Discord notifications (bot DMs)</label>

			{#if options.discord_notifications}
				<button id="discordNotificationsButton" class="button red" on:click={() => { options.discord_notifications = false; sendUserOptions(); }}>Disable</button>
			{:else}
				<button id="discordNotificationsButton" class="button green" on:click={() => { options.discord_notifications = true; sendUserOptions(); }}>Enable</button>
			{/if}
		</form>

		<div class="ruler-text">
			<span>manage projects</span>
		</div>

		<div class="projects-container">
			{#each projects as project}
				<div class="list-project">
					<div class="button-group">
						<a href="/profile/edit/{project.id}" class="button"><i class="fa-solid fa-pencil"></i></a>
						<button class="button red" on:click={() => { projectToDelete = project.id; deleteProjectModal = true; }}><i class="fa-solid fa-trash-can"></i></button>
					</div>

					<div>
						<span>{project.name}</span>
						<i>{project.description_short ?? project.description}</i>
					</div>
				</div>
			{/each}
		</div>

		<button id="newProject" class="button" on:click={() => { newProjectModal = true; }}><i class="fa-solid fa-plus"></i> New project</button>
	</div>
</div>

{#if newProjectModal}
	<div class="modal" transition:fly={{y: 20}}>
		<button class="modal-close" on:click={() => { newProjectModal = false; }}>
			<i class="fa-solid fa-xmark"></i>
		</button>

		<span class="modal-title">New project</span>

		<form on:submit={createNewProject}>
			<label for="newProjectName">Project name</label>
			<input id="newProjectName" type="text" placeholder="Project name" bind:value={newProjectName}>

			<button type="submit" class="button">Create</button>
		</form>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div transition:fade class="modal-darken" on:click={() => { newProjectModal = false; }}></div>
{/if}

{#if deleteProjectModal}
	<div class="modal" transition:fly={{y: 20}}>
		<button class="modal-close" on:click={() => { deleteProjectModal = false; }}>
			<i class="fa-solid fa-xmark"></i>
		</button>

		<span class="modal-title">Delete project</span>

		<p>Are you sure you want to delete this project?</p>

		<form on:submit={deleteProjectSubmit}>
			<button type="submit" class="button red">Delete</button>
		</form>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div transition:fade class="modal-darken" on:click={() => { deleteProjectModal = false; }}></div>
{/if}

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
	}

	form > * {
		display: block;
		margin-block: 1rem;
	}

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
	.list-project span {
		font-size: 1.125rem;
	}
	.list-project > div > i {
		display: block;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: var(--text-color-medium);
	}
	.button-group {
		float: right;
		display: flex;
		gap: 1rem;
	}

	#newProject {
		margin: auto;
		display: block;
		margin-top: 2rem;
	}

	.modal {
		position: fixed;
		z-index: 100;
		display: block;
		width: calc(100% - 2rem);
		max-width: 30rem;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		background-color: #333;
		padding: 1rem;
		border-radius: 1rem;
	}
	.modal-close {
		background: none;
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 2rem;
		color: var(--text-color-dark);
		cursor: pointer;
	}
	.modal button[type="submit"] {
		margin-top: 1rem;
	}
	.modal-title {
		font-size: 2rem;
		text-align: center;
		display: inline-block;
		width: 100%;
		margin-bottom: 1rem;
	}
	.modal-darken {
		position: fixed;
		z-index: 50;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.modal form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.modal form > * {
		margin: 0;
	}
</style>