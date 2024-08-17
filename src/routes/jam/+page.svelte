
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
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>
			Jams
		</h1>

		<div class="jam-list">
			{#each jams as jam}
				<a href="/jam/{jam.id}" class="no-link">
					<div class="jam">
						<h2>{jam.title}</h2>
						<span>{formatShortDate(jam.date_start)} / {formatShortDate(jam.date_end)}</span>
					</div>
				</a>
			{/each}
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

	.jam-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.jam {
		position: relative;
		padding-left: 2rem;
		transition: transform ease 125ms;
	}
	.jam:hover {
		transform: translateX(1rem);
	}

	.jam::before {
		position: absolute;
		content: "";
		background-color: var(--cc-lime);
		border-radius: 1rem;
		top: 0;
		bottom: 0;
		left: 0;
		width: 1rem;
	}

	.jam h2 {
		margin-bottom: 0.5rem;
	}

	.jam span {
		color: var(--text-color-dark);
	}
</style>