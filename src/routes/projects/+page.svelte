
<svelte:head>
	<title>Projects - PineStore</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="Projects - PineStore" />
	<meta property="og:description" content="Find ComputerCraft projects and search with tags!" />
	<meta name="description" content="Find ComputerCraft projects and search with tags!" />
	<meta name="twitter:description" content="Find ComputerCraft projects and search with tags!" />
	<meta property="og:url" content="https://pinestore.cc/projects" />
	<meta property="og:image" content="/pinestore_cropped.png" />
	<meta name="keywords" content="tag, tags, fun, tools, turtle, audio, other, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { tags } from "$lib/util.js";
    import TagList from "./../TagList.svelte";
	import ProjectList from "./../ProjectList.svelte";

	export let data;
	let displayProjects = [];

	let sortingMethod = "recent_downloads";	
	if (data.sort) sortingMethod = data.sort;
	let selectedTag = data.selectedTag;

	function filterProjects() {
		// use tags to filter projects
		if (selectedTag == null) return;
		displayProjects = displayProjects.filter(project => project.tags?.split(",").includes(selectedTag));
	}

	function sortProjects() {
		displayProjects = displayProjects.sort((a, b) => {
			if (sortingMethod == "recent_downloads")
				return b.downloads_recent - a.downloads_recent;
			else if (sortingMethod == "total_downloads")
				return b.downloads - a.downloads;
			else if (sortingMethod == "recent_published")
				return b.date_publish - a.date_publish;
			else if (sortingMethod == "recent_update")
				return (b.date_updated || b.date_publish) - (a.date_updated || a.date_publish); // using || since date_updated is 0 by default
		});
	}

	$: if (data.projects || sortingMethod) { // sort at least once and every time sortingMethod updates
		displayProjects = data.projects;
		filterProjects();
		sortProjects();

		// update query param, but quick check to make sure it doesn't run server side
		if (typeof window != "undefined") {
			let queryParams = [];
			if (sortingMethod != "recent_downloads")
				queryParams.push(`sort=${sortingMethod}`);
			if (selectedTag?.length > 0)
				queryParams.push(`tag=${selectedTag}`);

			let q = "";
			if (queryParams.length > 0)
				q = "?" + queryParams.join("&");
			window.history.pushState("changed sorting", "changed sorting", `/projects${q}`);
		}
	}

</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page shadow">
		<TagList bind:selectedTag={selectedTag} />

		<div class="list-header">
			<h2>Projects {selectedTag == null ? "(All)" : `(${tags.filter(t => t.id == selectedTag)[0].display})`}</h2>

			<select bind:value={sortingMethod}>
				<option value="recent_downloads">Recent downloads</option>
				<option value="total_downloads">Total downloads</option>
				<option value="recent_update">Recently updated</option>
				<option value="recent_published">Recently published</option>
			</select>
		</div>

		{#if displayProjects.length > 0}
			<ProjectList projects={displayProjects} blocks={true} />
		{:else}
			<i>There are currently no projects available in this category.</i>
		{/if}
	</div>
</div>

<style>
	.list-header {
		margin-top: 3rem;
		position: relative;
	}
	.list-header select {
		position: absolute;
		top: 0;
		right: 0;
	}

	@media (max-width: 30rem) {
		.list-header select {
			position: relative;
			margin-bottom: 2rem;
			width: 100%;
		}
	}
</style>