
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
    import JamDisplay from "../../lib/svelte/JamDisplay.svelte";

	export let data;
	let jams = data.jams;

	$: if (data) {
		jams = data.jams;
	}
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
				<JamDisplay {jam} />
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
</style>