
<svelte:head>
	<title>{submission.name} - {jam.title} submission</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{submission.name} by {submission.owner_name}" />
	<meta property="og:description" content="{submission.description_short || submission.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta name="description" content="{submission.description_short || submission.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta name="twitter:description" content="{submission.description_short || submission.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta property="og:url" content="{BASE_URL}{getSubmissionLink(submission.id, submission.name)}" />
	<meta property="og:image" content="{submission.has_thumbnail ? `${BASE_URL}/project/${submission.id}/thumbnail_full.webp` : "/project-placeholder.webp"}" />
	<meta name="keywords" content="{submission.name}, {submission.owner_name}, {(submission.keywords ?? []).join(",")}, {jam.title}, {(jam.title.split(" ")).join(", ")}, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { getProjectLink, tagToDisplay } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";
	
	import Markdown from "$lib/svelte/Markdown.svelte";
	import ImageGallery from "$lib/svelte/ImageGallery.svelte";
	
	export let data;
	let jam = data.jam;
	let submission = data.submission;

	$: if (data) {
		jam = data.jam;
		submission = data.submission;
	}

	let imageLinks = [];
	$: if (data) {
		imageLinks = [];
		for (let i = 0; i < submission.media_count; i++) {
			imageLinks.push(`${BASE_URL}/project/${submission.id}/image_${i}.webp`);
		}
	}

	function getSubmissionLink(id, name) {
		let encodedName = encodeURIComponent(name.replace(/[^a-zA-Z0-9]+/g," ").replaceAll(" ", "-").toLowerCase());
		return `/jam/${jam.id}/submissions/${id}/${encodedName}`;
	}

	function formatShortDate(d) {
		let projectDate = new Date(d);
		return projectDate.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}
	let projectDate = formatShortDate(submission.JamContestant.date_submitted);
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="jam-info">
			<span>Submitted on {projectDate}</span>
		</div>

		<a href="/jam/{jam.id}" class="no-link">
			<h1>
				{jam.title}
			</h1>
		</a>

		<a href="/user/{submission.owner_discord}"><img class="pfp" src="{BASE_URL}/pfp/{submission.owner_discord}.png" alt="profile"></a>

		<a href="{getProjectLink(submission.id, submission.name)}" class="no-link">
			<h2>
				{submission.name}
				<span class="subheader">by <a href="/user/{submission.owner_discord}">{submission.owner_name}</a></span>
			</h2>
		</a>

		<div class="tags-container">
			{#each submission.tags ?? [] as tag}
				<a class="button tag gray" href="/projects?tag={encodeURIComponent(tag)}">{tagToDisplay[tag]}</a>
			{/each}
		</div>

		<div id="description" class="markdown-container">
			{#if !submission.hide_thumbnail}
				{#if submission.has_thumbnail}
					<img class="project-image shadow" src="{BASE_URL}/project/{submission.id}/thumbnail_full.webp" alt="project thumbnail">
				{:else}
					<img class="project-image shadow" src="/project-placeholder.webp" alt="project thumbnail">
				{/if}
			{/if}
			
			{#if submission.description_markdown}
				<Markdown source={submission.description_markdown} />
			{:else if submission.description}
				<Markdown source={submission.description} />
			{:else}
				<Markdown source={"No description."} />
			{/if}
		</div>

		<ImageGallery {imageLinks} />
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 3rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	h1:hover, h2:hover {
		color: var(--cc--yellow);
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

	#description {
		margin-top: 1rem;
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

	.pfp {
		border-radius: 100vw;
		float: right;
		position: relative;
		top: 0;
		width: 6rem;
	}

	.project-image {
		width: 25rem;
		float: right;
		border-radius: 1rem;
		margin-left: 1rem;
		margin-bottom: 1rem;
	}

	@media screen and (max-width: 45rem) {
		.pfp {
			width: 4rem;
			top: 2rem;
		}

		.project-image {
			float: unset;
			width: 100%;
			margin-left: 0;
			margin-bottom: 1.5rem;
		}
	}

	.tags-container {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		font-size: 1rem;
		padding: 0.25rem 0.75rem;
	}
</style>