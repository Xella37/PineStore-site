
<svelte:head>
	<title>{jam.title}</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{jam.title}" />
	<meta property="og:description" content="{jam.description?.slice(0, 200) ?? "No description."}" />
	<meta name="description" content="{jam.description?.slice(0, 200) ?? "No description."}" />
	<meta name="twitter:description" content="{jam.description?.slice(0, 200) ?? "No description."}" />
	<meta property="og:url" content="{BASE_URL}/jam/{jam.id}" />
	<!-- TODO: add image -->
	<meta name="keywords" content="{jam.title}, {(jam.title.split(" ")).join(", ")}, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { fade } from "svelte/transition";
	import { onMount, onDestroy } from "svelte";
	import { addToast } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";
	
	import Markdown from "$lib/svelte/Markdown.svelte";
	
	export let data;
	let jam = data.jam;

	$: if (data) {
		jam = data.jam;
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
			return;

		let s = Math.floor(dt / 1000);
		seconds = s % 60;
		let m = Math.floor(s / 60);
		minutes = m % 60;
		let h = Math.floor(m / 60);
		hours = h % 60;
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
			{jam.title}
		</h1>

		<div class="info-block time">
			{#if !ended}
				<i class="fa-regular fa-hourglass-half"></i>

				<div class="timer">
					<div class="info">
						{#if started}
							Ends in
						{:else}
							Starts in
						{/if}
					</div>
					<div class="block">
						<span class="count">{days}</span>
						<span class="label">days</span>
					</div>
					<div class="block">
						<span class="count">{hours}</span>
						<span class="label">hours</span>
					</div>
					<div class="block">
						<span class="count">{minutes}</span>
						<span class="label">minutes</span>
					</div>
					<div class="block">
						<span class="count">{seconds}</span>
						<span class="label">seconds</span>
					</div>
				</div>
			{/if}
		</div>

		<div id="description" class="markdown-container">
			<Markdown source={jam.description_markdown} />
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
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
	.timer .info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#description {
		overflow: hidden;
		padding: 1.5rem;
		margin: -1.5rem;
		margin-top: 0;
		padding-bottom: 0;
	}
</style>