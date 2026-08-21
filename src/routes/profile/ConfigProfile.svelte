
<script>
	import Markdown from "$lib/svelte/Markdown.svelte";
	import ConnectionIcon from "$lib/svelte/ConnectionIcon.svelte";
	import { logoutUser, getMyProfile, setProfileInfo } from "$lib/database.js";
    import { onMount } from "svelte";
	import { addToast } from "$lib/util.js";
    import Modal from "$lib/svelte/Modal.svelte";

	let profile = {
		name: "loading...",
		profile_public: true,
		joined_on: 0,
		about: "loading...",
		about_markdown: "loading...",
	}
	let editingProfile = false;

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

	function logout() {
		logoutUser();
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

	onMount(() => {
		loadProfile();
	});
</script>

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

	{#if profile.profile_public}
		<span class="profile-public public">
			<i class="fa-solid fa-circle-check"></i>
			Profile is public
		</span>

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
						<a href="{con.link}" target="_blank"  class="no-link">
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
		<span class="profile-public hidden">
			<i class="fa-solid fa-triangle-exclamation"></i>
			Profile hidden!
		</span>
	{/if}
{:else}
	<form class="form-blocks">
		<label for="nameInput">Display name</label>
		<input id="nameInput" type="text" bind:value={profile.name}>

		<div class="option">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<button id="togglePublic" style="font-size: 1.75rem;" class="toggle" class:enabled={profile.profile_public} on:click|preventDefault={() => { profile.profile_public = !profile.profile_public; }}></button>
			<label for="togglePublic">Profile public</label>
		</div>

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

	.profile-public {
		--color: var(--cc-gray);
		display: inline-block;
		font-size: 1.5rem;
		border: solid 0.25rem var(--color);
		border-radius: 1rem;
		padding: 0.5rem 1rem;
		margin-block: 1rem;
		color: var(--text-color-medium);
	}
	.profile-public i {
		margin-right: 0.5em;
		color: var(--color);
	}
	.profile-public.public {
		--color: var(--cc-blue);
	}
	.profile-public.hidden {
		--color: var(--cc-red);
	}

	.form-blocks > * {
		display: block;
		margin-block: 1rem;
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
</style>