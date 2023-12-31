
<svelte:head>
	<title>Profile</title>
	<!-- <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script> -->
</svelte:head>

<script>
	import Markdown from "$lib/svelte/Markdown.svelte";
	import ConnectionIcon from "$lib/svelte/ConnectionIcon.svelte";
    import Modal from "$lib/svelte/Modal.svelte";
	import { onMount } from "svelte";
	import { logoutUser, getMyProjects, getMyProfile, newProject, setProfileInfo, deleteProject, getUserOptions, setUserOptions } from "$lib/database.js";
	import { addToast } from "$lib/util.js";
    import AnalyticsGraph from "./AnalyticsGraph.svelte";

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
			return addToast("Failed!", "Error: " + (projectsData.error ?? "no error"), "error");
		projects = projectsData.projects.sort((a, b) => {
			let tB = Math.max(b.date_updated, b.date_publish, b.date_added);
			let tA = Math.max(a.date_updated, a.date_publish, a.date_added);
			return tB - tA;
		});
	}

	async function loadProfile() {
		let profileData = await getMyProfile();
		if (!profileData.success)
			return addToast("Failed!", "Error: " + (profileData.error ?? "no error"), "error");
		profile = profileData.user;
	}

	async function saveProfile() {
		await setProfileInfo(profile);
		addToast("Saved!", "Your account info has successfully been saved.", "success", 3);
	}

	let newProjectModal = false;
	let newProjectName = "";
	async function createNewProject() {
		newProjectModal = false;
		let data = await newProject(newProjectName);
		if (data.success) {
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

	let connectionId = "link";
	let connectionDisplay = "";
	let connectionLink = "";
	let addConnectionModal = false;
	async function addConnectionSubmit() {
		profile.connections.push({
			id: connectionId,
			display: connectionDisplay,
			link: connectionLink,
		});
		profile.connections = profile.connections;
		addConnectionModal = false;
	}
	function removeConnection(index) {
		profile.connections.splice(index, 1);
		profile.connections = profile.connections;
	}

	let options = {};
	async function sendUserOptions(e) {
		await setUserOptions(options);
		addToast("Updated!", "Updated user options!", "success", 3);
	}

	async function loadOptions() {
		let optionsData = await getUserOptions();
		options = optionsData.options ?? {};
	}

	let toggleOptions = [
		{id: "discord_noti_comment", title: "New comments on your projects"},
		{id: "discord_noti_reply", title: "New replies to your comments"},
		{id: "discord_noti_newfollow_user", title: "New followers"},
		{id: "discord_noti_newfollow_project", title: "New project saves/followers"},
		{id: "discord_noti_milestone_views", title: "Milestones for your project views"},
		{id: "discord_noti_milestone_downloads", title: "Milestones for your project downloads"},
		{id: "discord_noti_following_newproject", title: "Newly published project from following"},
		{id: "discord_noti_following_projectupdate", title: "Updates for saved projects"},
	];
	async function toggleOption(option) {
		console.log("Toggle " + option);
		options[option] = !options[option];
		console.log(options);
		await sendUserOptions();
	}

	let selectedAnalytics = "download";

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
				<a href="/user/{profile.discord_id}" target="_blank" class="button">
					<i class="fa-solid fa-arrow-up-right-from-square"></i>
					View profile
				</a>
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
					<Markdown source={profile.about_markdown} />
				{:else if profile.about}
					<Markdown source={profile.about} />
				{:else}
					<Markdown source={"No about info..."} />
				{/if}
			</p>

			<h2>Connections</h2>
			{#if profile.connections?.length > 0}
				<div class="connections-container">
					{#each profile.connections as con}
						{#if con.link?.length > 0}
							<a href="{con.link}" class="no-link">
								<div class="connection">
									<span class="connection-icon"><ConnectionIcon id={con.id} /></span>
									{con.display}
								</div>
							</a>
						{:else}
							<div class="connection no-link">
								<span class="connection-icon"><ConnectionIcon id={con.id} /></span>
								{con.display}
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				<p>None</p>
			{/if}
		{:else}
			<form class="form-blocks">
				<label for="nameInput">Display name</label>
				<input id="nameInput" type="text" bind:value={profile.name}>

				<label for="aboutInput">About (plaintext)</label>
				<textarea id="aboutInput" type="text" bind:value={profile.about}></textarea>

				<label for="aboutMDInput">About (markdown)</label>
				<textarea id="aboutMDInput" type="text" bind:value={profile.about_markdown}></textarea>
			</form>

			<h2>Connections</h2>
			{#if profile.connections?.length > 0}
				<div class="connections-container">
					{#each profile.connections as con, i}
						<div class="connection no-link">
							<button class="button red remove-connection" on:click|preventDefault={() => { removeConnection(i); }}>
								<i class="fa-solid fa-trash-can"></i>
							</button>
							<span class="connection-icon"><ConnectionIcon id={con.id} /></span>
							{con.display}
							<span class="connection-link">{con.link}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p>None</p>
			{/if}

			<button id="addConnection" class="button" on:click={() => { addConnectionModal = true; }}><i class="fa-solid fa-plus"></i> Add connection</button>
		{/if}

		<div class="ruler-text">
			<span>user options</span>
		</div>

		<form>
			<h2>Discord notifications (bot DMs)</h2>
			<p>All notifications will be visible in the top-right, but you can additionally enable to be notified on Discord with a DM from our bot.</p>
			<p>You must have a Discord server in common with our bot. You can <a href="https://discord.com/oauth2/authorize?client_id=1073728324142116948&scope=bot&permissions=277025475584">add the bot</a> to your server, or alternatively join <a href="https://discord.gg/sNhyBjGez5">our Discord server</a>.</p>

			<div class="options-list">
				{#each toggleOptions as option}
					<div class="option">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<button id="toggleButton-{option.id}" style="font-size: 1.75rem;" class="toggle" class:enabled={options != null && options[option.id]} on:click|preventDefault={() => { toggleOption(option.id); }}></button>
						<label for="toggleButton-{option.id}">{option.title}</label>
					</div>
				{/each}
			</div>
		</form>

		<div class="ruler-text">
			<span>project analytics</span>
		</div>

		<div class="flex-list">
			<button class="button tab" class:selected={selectedAnalytics == "view"} on:click|preventDefault={() => { selectedAnalytics = "view" }}>Views</button>
			<button class="button tab" class:selected={selectedAnalytics == "download"} on:click|preventDefault={() => { selectedAnalytics = "download" }}>Downloads</button>
			<!-- <button class="button tab" class:selected={selectedAnalytics == "like"} on:click|preventDefault={() => { selectedAnalytics = "like" }}>Likes</button> -->
		</div>

		{#if projects.length > 0}
			<div class="tab-container">
				{#if selectedAnalytics == "view"}
					<AnalyticsGraph kind={selectedAnalytics} title="Views" projects={projects} />
				{:else if selectedAnalytics == "download"}
					<AnalyticsGraph kind={selectedAnalytics} title="Downloads" projects={projects} />
				<!-- {:else if selectedAnalytics == "like"}
					<AnalyticsGraph kind={selectedAnalytics} title="Likes" projects={projects} /> -->
				{/if}
			</div>
		{/if}

		<div class="ruler-text">
			<span>manage projects</span>
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
	</div>
</div>

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

<Modal title="Add connection" bind:opened={addConnectionModal}>
	<p>Add a new connection to your account</p>

	<form class="model-form" on:submit|preventDefault={addConnectionSubmit}>
		<label for="connectionType">Type</label>
		<select id="connectionType" bind:value={connectionId}>
			<option value="link">Direct Link</option>
			<option value="github">GitHub</option>
			<option value="discord">Discord</option>
			<option value="twitterx">Twitter</option>
			<option value="youtube">YouTube</option>
			<option value="twitch">Twitch</option>
			<option value="reddit">Reddit</option>
			<option value="steam">Steam</option>
		</select>

		<label for="connectionDisplay">Display</label>
		<input id="connectionDisplay" type="text" placeholder="Username" bind:value={connectionDisplay}>
		
		<label for="connectionLink">Link</label>
		<input id="connectionLink" type="text" placeholder="https://example.com/myaccount" bind:value={connectionLink}>

		<button type="submit" class="button green">Add</button>
	</form>
</Modal>

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
	@media screen and (max-width: 50rem) {
		.corner-buttons {
			width: 100%;
		}
	}

	.form-blocks > * {
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

	.model-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.options-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
	}
	.option {
		display: inline-flex;
		justify-content: left;
	}
	.option label {
		display: inline-block;
		margin: auto;
		margin-left: 1rem;
		cursor: pointer;
	}

	.connections-container {
		margin-bottom: 1rem;
	}
	.connections-container > * {
		display: block;
		margin-bottom: 0.5rem;
		max-width: fit-content;
	}
	.connection.no-link {
		color: var(--text-color-medium);
	}
	.connection-icon {
		margin-right: 0.5em;
		color: var(--text-color);
	}
	.connection-link {
		color: var(--text-color-dark);
		margin-left: 0.5em;
	}
	.remove-connection {
		font-size: 0.8rem;
		padding: 0.25rem 0.5rem;
		border-radius: 2rem;
		margin-right: 0.5rem;
	}

	.tab {
		background-color: var(--cc-gray);
		color: white;
	}
	.tab.selected {
		background-color: var(--cc-blue);
	}
	.tab-container {
		margin-top: 2rem;
	}
</style>