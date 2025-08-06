
<svelte:head>
	<title>{jam.title}</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{jam.title}" />
	<meta property="og:description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta name="description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta name="twitter:description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta property="og:url" content="{BASE_URL}/jam/{jam.id}" />
	<meta property="og:image" content="https://pinestore.cc/pinejam2025.png" />
	<meta name="keywords" content="{jam.title}, {(jam.title.split(" ")).join(", ")}, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { onMount, onDestroy } from "svelte";
	import { addToast } from "$lib/util.js";
	import { BASE_URL, getProject, getMyProfile, checkMyJamStatus, joinJam, leaveJam, getMyProjects, submitJam } from "$lib/database.js";
	
	import Modal from "$lib/svelte/Modal.svelte";
	import Markdown from "$lib/svelte/Markdown.svelte";
	
	export let data;
	let jam = data.jam;

	$: if (data) {
		jam = data.jam;
	}

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

	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	let started = false;
	let ended = false;

	function updateTimerText() {
		let start = jam.date_start;
		let end = jam.date_end;
		let now = Date.now();
		started = now > start;
		ended = now > end;

		let dt = start - now;
		if (started)
			dt = end - now;
		if (ended)
			dt = 0;

		let s = Math.floor(dt / 1000);
		seconds = s % 60;
		let m = Math.floor(s / 60);
		minutes = m % 60;
		let h = Math.floor(m / 60);
		hours = h % 24;
		days = Math.floor(h / 24);
	}
	updateTimerText();

	let interval;

	function resetInterval() {
		clearInterval(interval);
		interval = setInterval(updateTimerText, 1000);
	}
	onMount(() => {
		resetInterval();
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="jam-info">
			<span>{jam.contestant_count} joined</span>
			{#if started}
				<span>{jam.submission_count} {jam.submission_count == 1 ? "submission" : "submissions"}</span>
			{/if}
		</div>

		<h1>
			{jam.title}
		</h1>

		<div class="info-block time">
			<i class="fa-regular fa-hourglass-half"></i>

			<div class="timer">
				<div class="info">
					{#if !started}
						Starts in
					{:else if !ended}
						Ends in
					{:else if !jam.judging_finished}
						Judging in progress...
					{:else}
						JAM ENDED
					{/if}
				</div>
				<div class="block">
					<span class="count">{days}</span>
					<span class="label">{days == 1 ? "day" : "days"}</span>
				</div>
				<div class="block">
					<span class="count">{hours}</span>
					<span class="label">{hours == 1 ? "hour" : "hours"}</span>
				</div>
				<div class="block">
					<span class="count">{minutes}</span>
					<span class="label">{minutes == 1 ? "minute" : "minutes"}</span>
				</div>
				<div class="block">
					<span class="count">{seconds}</span>
					<span class="label">{seconds == 1 ? "second" : "seconds"}</span>
				</div>
			</div>
		</div>

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
				<a class="button view-submission-button" href="/jam/{jam.id}/submissions">View submissions</a>
			{/if}
		{/if}

		<div id="description" class="markdown-container">
			<Markdown source={jam.description_markdown} />
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
	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.jam-info {
		display: flex;
		flex-direction: column;
		float: right;
		margin-top: 3rem;
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

	.info-block.time {
		background-color: var(--cc-green);
	}

	.timer {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.timer > div.block {
		display: flex;
		flex-direction: column;
		border: 0.125rem white solid;
		border-radius: 1rem;
		min-width: 4.5rem;
		padding: 0.5rem 0.25rem;
	}
	.timer .count {

	}
	.timer .label {
		font-size: 0.75rem;
	}
	.timer div.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (width < 720px) {
		.info-block.time {
			padding-left: 5rem;
		}

		.timer {
			gap: 1rem;
		}

		.timer div.info {
			width: 100%;
		}

		.timer > div.block {
			min-width: 34%;
			width: 3rem;
			padding: 0.3rem 0.15rem;
		}
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
</style>