
<svelte:head>
	<title>Jam List</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="Jam List" />
	<meta property="og:description" content="View all PineStore jams so far!" />
	<meta name="description" content="View all PineStore jams so far!" />
	<meta name="twitter:description" content="View all PineStore jams so far!" />
	<meta property="og:url" content="{BASE_URL}/jam" />
	<!-- <meta property="og:image" content="https://pinestore.cc/pinejam2024.png" /> -->
	<meta name="keywords" content="jams, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { BASE_URL } from "$lib/database.js";

	export let data;
	let jams = data.jams;

	$: if (data) {
		jams = data.jams;
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

	const STATUS_MAP = {
		"starting": "Starting soon",
		"ongoing": "Active now",
		"judging": "Judging in progress",
		"results": "Results out",
	};
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>
			PineStore Jams
		</h1>

		<p>
			Here you can find all the jams that have been held on PineStore so far. You can click on a jam to view its submissions, results, and other information.
		</p>

		<div class="ruler-text">
			<span>all jams</span>
		</div>

		<div class="jam-list">
			{#each jams as jam}
				<a href="/jam/{jam.id}" class="no-link">
					<div class="jam" class:status-starting={jam.status === "starting"} class:status-ongoing={jam.status === "ongoing"} class:status-judging={jam.status === "judging"} class:status-results={jam.status === "results"}>
						<h2>{jam.title}</h2>
						<span class="period">{formatShortDate(jam.date_start)} / {formatShortDate(jam.date_end)}</span>

						<span class="status">{STATUS_MAP[jam.status]}</span>

						<img src="{BASE_URL}/{jam.id}.png" alt="Banner for {jam.title}" class="jam-logo" />
					</div>
				</a>
			{/each}
		</div>

		{#if !jams.find(jam => jam.id === "pinejam2023")}
			<p style="margin-top: 1rem;">
				Note: PineJam 2023 is not listed here yet. You can view it <a href="https://jam.pine3d.cc/jam/2023" target="_blank">here</a>.
			</p>
		{/if}
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

	.jam-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 2rem;
	}

	.jam {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* min-height: 8rem; */
		--status-color: #FFF;
		border-radius: 1rem;
		padding: 1rem;
	}
	.jam:hover {
		background-color: var(--cc-gray);
	}

	.jam.status-starting {
		--status-color: var(--cc-green);
	}
	.jam.status-ongoing {
		--status-color: var(--cc-green);
	}
	.jam.status-judging {
		--status-color: var(--cc-cyan);
	}
	.jam.status-results {
		--status-color: var(--cc-blue);
	}

	.jam::before {
		position: absolute;
		content: "";
		background-color: var(--status-color);
		border-radius: 1rem;
		top: 0;
		bottom: 0;
		left: -2rem;
		width: 1rem;
	}

	.jam h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.jam span.period {
		color: var(--text-color-dark);
	}

	.jam span.status {
		display: block;
		margin-top: 1rem;
		color: var(--text-color);
		background-color: var(--status-color);
		font-size: 1.25rem;
		max-width: fit-content;
		padding: 0.25rem 1rem;
		border-radius: 2rem;
	}

	.jam img {
		position: absolute;
		top: 50%;
		right: 1rem;
		max-width: 20rem;
		height: calc(min(8rem, 100% - 2rem));
		transform: translateY(-50%);
		object-fit: contain;
	}
</style>