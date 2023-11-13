
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
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import { tags } from "$lib/util.js";
	import { getMySavedProjects } from "$lib/database.js";
    import TagList from "$lib/svelte/TagList.svelte";
	import ProjectList from "$lib/svelte/ProjectList.svelte";

	export let data;
	let displayProjects = [];

	let getSavedFailed = false;

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
			if (sortingMethod == "recent_downloads") {
				let dDownloadsRecent = b.downloads_recent - a.downloads_recent;
				if (dDownloadsRecent != 0) return dDownloadsRecent;
				let dDownloads = b.downloads - a.downloads;
				if (dDownloads != 0) return dDownloads;
				let dPublish = b.date_publish - a.date_publish;
				return dPublish;
			} else if (sortingMethod == "total_downloads") {
				return b.downloads - a.downloads;
			} else if (sortingMethod == "recent_views") {
				let dViewsRecent = b.views_recent - a.views_recent;
				if (dViewsRecent != 0) return dViewsRecent;
				let dViews = b.views - a.views;
				if (dViews != 0) return dViews;
				let dPublish = b.date_publish - a.date_publish;
				return dPublish;
			} else if (sortingMethod == "total_views") {
				return b.views - a.views;
			} else if (sortingMethod == "recent_published") {
				return b.date_publish - a.date_publish;
			} else if (sortingMethod == "recent_update") {
				return (b.date_updated || b.date_publish) - (a.date_updated || a.date_publish); // using || since date_updated is 0 by default
			}
		});
	}

	async function updateDisplayProjects() {
		if (selectedTag == "saved") {
			let savedData = await getMySavedProjects();
			if (savedData.success) {
				displayProjects = savedData.projects;
			} else {
				getSavedFailed = true;
				displayProjects = [];
			}
		} else {
			displayProjects = data.projects;
			filterProjects();
		}
		sortProjects();

		// update query param, but quick check to make sure it doesn't run server side
		if (browser) {
			let queryParams = [];
			if (sortingMethod != "recent_downloads")
				queryParams.push(`sort=${sortingMethod}`);
			if (selectedTag?.length > 0)
				queryParams.push(`tag=${selectedTag}`);

			let q = "";
			if (queryParams.length > 0)
				q = "?" + queryParams.join("&");
			goto(`/projects${q}`);
		}
	}

	$: if (data.projects || selectedTag || sortingMethod) { // sort at least once and every time sortingMethod updates
		updateDisplayProjects();
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
				<option value="total_views">Total views</option>
				<option value="recent_views">Recent views</option>
			</select>
		</div>

		{#if displayProjects.length > 0}
			<ProjectList projects={displayProjects} blocks={true} />
		{:else if selectedTag == "saved"}
			{#if getSavedFailed}
				<p class="no-projects-placeholder">
					Login with Discord to save projects. Saved projects will show up here.
				</p>
			{:else}
				<p class="no-projects-placeholder">
					Saved projects will show up here. To save a project, open a projects page and click "Save" at the top.
				</p>
			{/if}
		{:else}
			<i class="no-projects-placeholder">
				There are currently no projects available with this tag.
			</i>
			<p class="no-projects-placeholder">
				Do you want to add your own project?<br>
				Simply login with Discord to create and manage your projects to share them with others!
			</p>
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

	@media (max-width: 37rem) {
		.list-header select {
			position: relative;
			margin-bottom: 2rem;
			width: 100%;
		}
	}

	i.no-projects-placeholder {
		color: var(--text-color-medium);
	}
	p.no-projects-placeholder {
		margin-top: 1rem;
		margin-bottom: 0;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		background-color: var(--cc-gray);
		color: var(--text-color);
		font-size: 1.125rem;
		line-height: 1.75rem;
	}
</style>