
<svelte:head>
	<title>{jam.title}</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{jam.title}" />
	<meta property="og:description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta name="description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta name="twitter:description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta property="og:url" content="{BASE_URL}/jam/{jam.id}" />
	<meta property="og:image" content="https://pinestore.cc/{jam.id}.png" />
	<meta name="keywords" content="{jam.title}, {(jam.title.split(" ")).join(", ")}, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { addToast } from "$lib/util.js";
	import { BASE_URL, getProject, getMyProfile, checkMyJamStatus, joinJam, leaveJam, getMyProjects, submitJam } from "$lib/database.js";
	
	import Modal from "$lib/svelte/Modal.svelte";
	import Markdown from "$lib/svelte/Markdown.svelte";
    import Timer from "./Timer.svelte";
    import Judges from "./Judges.svelte";
	
	export let data;
	let jam = data.jam;
	$: judges = data.judges;

	$: if (data) {
		jam = data.jam;
	}

	let started = false;
	let ended = false;

	let loginModalOpen = false;
	let submissionModalOpen = false;

	let user;
	let joined = false;
	let submittedProject = null;

	onMount(async () => {
		let profileData = await getMyProfile();
		user = profileData?.user;
		if (user != null) {
			let jamStatus = await checkMyJamStatus(jam.id);
			joined = jamStatus.joined;
			if (jamStatus.project_submitted != null) {
				let projectData = await getProject(jamStatus.project_submitted);
				submittedProject = projectData.project;
			}
		}
	});

	let projects = [];
	async function clickSubmit() {
		if (!started || ended)
			return;

		submissionModalOpen = true;
		let data = await getMyProjects();
		projects = data.projects.filter(p => {
			return p.date_added >= jam.date_start && p.visible;
		});
	}
	let submissionProjectId = "";
	async function submitProject() {
		if (submissionProjectId.length <= 0)
			return;

		let res = await submitJam(jam.id, parseInt(submissionProjectId));
		if (res.success) {
			addToast("Submitted!", `Your project has been submitted successfully!`, "success", 3);
			jam.submission_count++;
			let projectData = await getProject(parseInt(submissionProjectId));
			submittedProject = projectData.project;
		} else {
			addToast("Failed!", "Error: " + (res.error ?? "no error"), "error");
		}
		submissionModalOpen = false;
	}
	async function clickJoin() {
		if (user == null) {
			loginModalOpen = true;
			return;
		}

		joined = true;
		let res = await joinJam(jam.id);
		if (res.success) {
			addToast("Joined!", `You have joined ${jam.title}!`, "success", 3);
			jam.contestant_count++;
		} else {
			joined = false;
			addToast("Failed!", "Error: " + (res.error ?? "no error"), "error");
		}
	}
	async function clickLeave() {
		joined = false;
		let res = await leaveJam(jam.id);
		if (res.success) {
			addToast("Left!", `You have left ${jam.title}.`, "success", 3);
			jam.contestant_count--;
		} else {
			joined = true;
			addToast("Failed!", "Error: " + (res.error ?? "no error"), "error");
		}
	}
	
	function formatShortDate(d) {
		let projectDate = new Date(d);
		return projectDate.toLocaleDateString("en-US", {
			hour: "numeric",
			minute: "numeric",
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth={innerWidth} />

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="columns">
		<div class="column main-content island">
			{#if innerWidth > 1270}
				<Timer {jam} bind:started bind:ended />
				<span class="period">from {formatShortDate(jam.date_start)} to {formatShortDate(jam.date_end)}</span>
			{/if}

			<div id="description" class="markdown-container">
				<Markdown source={jam.description_markdown} />
			</div>
		</div>

		<div class="column sidebar island">
			<div class="jam-info">
				<span>{jam.contestant_count} joined</span>
				{#if started}
					<span>{jam.submission_count} {jam.submission_count == 1 ? "submission" : "submissions"}</span>
				{/if}
			</div>

			<h1>
				{jam.title}
			</h1>

			{#if innerWidth <= 1270}
				<Timer {jam} bind:started bind:ended />
				<span class="period">from {formatShortDate(jam.date_start)} to {formatShortDate(jam.date_end)}</span>
			{/if}

			<div class="actions">
				{#if joined}
					{#if submittedProject == null}
						{#if ended}
							<span class="submission-text">You can no longer submit.</span>
						{:else}
							<button class="button" class:disabled={!started || ended} on:click|preventDefault={clickSubmit}>Submit project</button>
							<button class="button red" on:click|preventDefault={clickLeave}>Leave jam</button>
						{/if}
					{:else}
						<span class="submission-text">You have submitted "{submittedProject.name}"</span>
					{/if}
				{:else}
					{#if ended}
						<span class="submission-text">You can no longer join.</span>
					{:else}
						<button class="button" on:click|preventDefault={clickJoin}>Join jam</button>
					{/if}
				{/if}
			</div>

			{#if started}
				{#if jam.judging_finished}
					<a class="button view-submission-button" href="/jam/{jam.id}/submissions">View results</a>
				{:else}
					{#if user?.discord_id == jam.organizer_discord}
						<div class="button-group">
							<a class="button overview-button" href="/jam/{jam.id}/organizer">Overview</a>
							<a class="button view-submission-button" href="/jam/{jam.id}/submissions">View submissions</a>
						</div>
					{:else}
						<a class="button view-submission-button" href="/jam/{jam.id}/submissions">View submissions</a>
					{/if}
				{/if}
			{/if}

			{#if judges.length > 0}
				<span class="ruler-text">judges</span>
				<Judges {judges} />
			{/if}
		</div>
	</div>
</div>

<Modal title="Login" bind:opened={loginModalOpen}>
	<p>To save and follow projects, you need to be logged in on the site.</p>
	<a href="https://discord.com/api/oauth2/authorize?client_id=1073728324142116948&redirect_uri=https%3A%2F%2Fpinestore.cc%2Fdiscordauth&response_type=code&scope=identify" class="modal-button button">
		<i class="fa-brands fa-discord"></i>
		Login with Discord
	</a>
</Modal>

<Modal title="Submit Jam Project" bind:opened={submissionModalOpen}>
	<p>Submit your project for the jam!</p>
	<p>Pick one of your projects to submit. Don't see your project? Make sure your project is created after the start of the jam, and that your project <b>has been published</b>.</p>

	<form class="submission-form" on:submit|preventDefault={submitProject}>
		<select bind:value={submissionProjectId}>
			<option value="" disabled selected>Select project</option>
			{#each projects as project}
				<option value="{project.id}">
					{project.name}
				</option>
			{/each}
		</select>

		<button type="submit" class="button" class:disabled={!(parseInt(submissionProjectId) > 0)}>Submit Project</button>
	</form>
</Modal>

<style>
	.page-container {
		--island-spacing: 4rem;
		--island-padding: 2rem;
	}

	.columns {
		position: relative;
		display: flex;
		flex-direction: row;
		gap: var(--island-spacing);
		padding: var(--island-spacing);
		align-items: flex-start;
		justify-content: center;
	}
	.column {
		flex: 1;
	}

	@media (max-width: 1270px) {
		.columns {
			flex-direction: column-reverse;
		}
		.column {
			width: 100%;
			max-width: 100%!important;
			box-sizing: border-box;
		}
	}

	@media (max-width: 800px) {
		.page-container {
			--island-spacing: 2rem;
		}
	}
	@media (max-width: 450px) {
		.page-container {
			--island-spacing: 1rem;
			--island-padding: 1rem;
		}
	}

	.main-content {
		flex: 5;
		max-width: 50rem;
	}

	.sidebar {
		flex: 2;
		min-width: 14rem;
		max-width: 26rem;
	}

	.sidebar h1 {
		font-size: 2rem;
		margin-top: 0rem;
		margin-bottom: 2rem;
	}

	.jam-info {
		display: flex;
		flex-direction: column;
		float: right;
		/* margin-top: 0; */
		font-size: 1.5rem;
		font-weight: normal;
		color: var(--cc-lightGray);
		text-align: right;
	}

	@media screen and (max-width: 45rem) {
		h1 {
			font-size: 2.5rem;
		}
	}
	@media screen and (max-width: 30rem) {
		h1 {
			font-size: 1.75rem;
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	}

	span.period {
		color: var(--text-color-dark);
		text-align: center;
		display: block;
		font-size: 1.25rem;
		margin-block: 1.5rem;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
	.submission-text {
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: var(--text-color-medium);
	}

	#description {
		overflow: hidden;
		padding: 1.5rem;
		margin: -1.5rem;
		margin-top: 0;
		padding-bottom: 0;
	}
	#description :global(img) {
		box-shadow: unset!important;
	}
	#description :global(td), #description :global(th) {
		text-align: left;
		padding: 0.5rem 1rem;
	}

	#description :global(h3) {
		font-size: 3rem;
		text-align: center;
		background: linear-gradient(#dedf6d, #f2b234);background-clip: text;-webkit-background-clip: text;color: transparent;font-weight: bold;
	}

	.modal-button {
		display: block;
		box-sizing: border-box;
		width: 100%;
		text-align: center;
	}
	.modal-button > i {
		margin-right: 0.5em;
	}

	.submission-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.view-submission-button {
		display: block;
		margin-block: 1rem;
	}
	.button-group {
		display: flex;
		gap: 1rem;
		margin-block: 1rem;
		flex-wrap: wrap;
	}
	.button-group .button {
		flex: 1;
		display: inline-block;
		margin-block: 0;
	}
</style>