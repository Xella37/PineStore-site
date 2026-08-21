<script>
    import AnalyticsGraph from "./AnalyticsGraph.svelte";
	import { getMyProjects } from "$lib/database.js";
    import { onMount } from "svelte";

	let projects = [];

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

	onMount(() => {
		loadProjects();
	});

	let selectedAnalytics = "download";
</script>

<h2>Analytics</h2>

<p>
	Select one of the graph groups to view recent analytical history for your projects.
</p>

<div class="ruler-text">
	<span>graph groups</span>
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

<style>
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