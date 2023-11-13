
<svelte:head>
	<title>Search - PineStore</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="Search - PineStore" />
	<meta property="og:description" content="Search through all ComputerCraft projects in our database with a simple keyword search!" />
	<meta name="description" content="Search through all ComputerCraft projects in our database with a simple keyword search!" />
	<meta name="twitter:description" content="Search through all ComputerCraft projects in our database with a simple keyword search!" />
	<meta property="og:url" content="https://pinestore.cc/search" />
	<meta property="og:image" content="/pinestore_cropped.png" />
	<meta name="keywords" content="search, look up, look, search through, index, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { searchProjects } from "$lib/database.js";
    import ProjectList from "$lib/svelte/ProjectList.svelte";
	import { onMount } from "svelte";
	import { addToast } from "$lib/util.js";

	let searchQuery = "";
	let projects = null;

	async function search() {
		let data = await searchProjects(searchQuery);
		if (data.success) {
			projects = data.projects;
			if (projects.length <= 0)
				addToast("No results!", "No results found for your search.", "info", 3);
		} else {
			addToast("Failed!", "Error: " + (data.error ?? "no error"), "error");
		}
	}

	let searchInput;
	onMount(() => {
		searchInput.focus();
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>All ComputerCraft projects</h1>
		<form on:submit|preventDefault={search}>
			<input bind:this={searchInput} type="text" bind:value={searchQuery} placeholder="Search query">
			<button type="submit" class="button">
				<i class="fa-solid fa-magnifying-glass"></i>
				<span>Search</span>
			</button>
		</form>

		{#if projects != null}
			<div class="ruler-text">
				<span>{projects.length} {projects.length == 1 && "result" || "results"}</span>
			</div>
			<div id="results">
				<ProjectList projects={projects} blocks={true} />
			</div>
		{:else}
			<div id="projectsPlaceholder">
				<i class="fa-solid fa-file-image"></i>
				Enter a search query to look for any project in the database!
			</div>
		{/if}
	</div>
</div>

<style>
	form {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
	form input {
		flex-grow: 1;
		min-width: 3rem;
	}
	@media screen and (max-width: 30rem) {
		form button span {
			display: none;
		}
	}

	#projectsPlaceholder {
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 2rem;
		padding-top: 4rem;
		padding-bottom: 2rem;
		color: var(--text-color-dark);
		font-size: 1.5rem;
		max-width: 25rem;
		margin: auto;
	}
	#projectsPlaceholder > i {
		font-size: 8rem;
		color: var(--cc-gray);
	}
</style>