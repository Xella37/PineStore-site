
<svelte:head>
	<title>{jam.title}</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{jam.title}" />
	<meta property="og:description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta name="description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta name="twitter:description" content="{jam.description_markdown?.slice(0, 200) ?? "No description."}" />
	<meta property="og:url" content="{BASE_URL}/jam/{jam.id}" />
	<meta property="og:image" content="https://pinestore.cc/pinejam2024.png" />
	<meta name="keywords" content="{jam.title}, {(jam.title.split(" ")).join(", ")}, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { fade } from "svelte/transition";
	import { onMount, onDestroy } from "svelte";
	import { addToast } from "$lib/util.js";
	import { BASE_URL, getMyProfile, checkJoinedJam, joinJam, leaveJam } from "$lib/database.js";
	
	import Modal from "$lib/svelte/Modal.svelte";
	import Markdown from "$lib/svelte/Markdown.svelte";
	
	export let data;
	let jam = data.jam;

	$: if (data) {
		jam = data.jam;
	}

	let loginModalOpen = false;

	let user;
	let joined = false;

	onMount(async () => {
		let profileData = await getMyProfile();
		user = profileData?.user;
		if (user != null) {
			let joinData = await checkJoinedJam(jam.id);
			console.log(joinData);
			joined = joinData.joined;
		}
	});

	async function clickSubmit() {

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

		<h1>
			<span class="joined-count">{jam.contestant_count} joined</span>
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
				<button class="button disabled" on:click|preventDefault={clickSubmit}>Submit project</button>
				<button class="button red" on:click|preventDefault={clickLeave}>Leave jam</button>
			{:else}
				<button class="button" on:click|preventDefault={clickJoin}>Join jam</button>
			{/if}
		</div>

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

<style>
	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.joined-count {
		float: right;
		font-size: 2rem;
		font-weight: normal;
		color: var(--cc-lightGray);
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

	.modal-button {
		display: block;
		box-sizing: border-box;
		width: 100%;
		text-align: center;
	}
	.modal-button > i {
		margin-right: 0.5em;
	}
</style>