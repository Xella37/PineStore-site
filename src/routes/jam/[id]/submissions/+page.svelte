
<svelte:head>
	<title>{jam.title} - submissions</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{jam.title}" />
	<meta property="og:description" content="View all submissions for {jam.title} and explore the cool creations everyone has made!" />
	<meta name="description" content="View all submissions for {jam.title} and explore the cool creations everyone has made!" />
	<meta name="twitter:description" content="View all submissions for {jam.title} and explore the cool creations everyone has made!" />
	<meta property="og:url" content="{BASE_URL}/jam/{jam.id}/submissions" />
	<meta property="og:image" content="https://pinestore.cc/pinejam2024.png" />
	<meta name="keywords" content="{jam.title}, {(jam.title.split(" ")).join(", ")}, submissions, submission, jam, ccjam, pinejam, contest, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { tagToDisplay } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";
	
	import Modal from "$lib/svelte/Modal.svelte";
	
	export let data;
	let jam = data.jam;
	let submissions = data.submissions;

	$: if (data) {
		jam = data.jam;
		submissions = data.submissions;
	}

	function getSubmissionLink(id, name) {
		let encodedName = encodeURIComponent(name.replace(/[^a-zA-Z0-9]+/g," ").replaceAll(" ", "-").toLowerCase());
		return `/jam/${jam.id}/submissions/${id}/${encodedName}`;
	}
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="jam-info">
			<span>{jam.contestant_count} joined</span>
			<span>{jam.submission_count} {jam.submission_count == 1 ? "submission" : "submissions"}</span>
		</div>

		<a href="/jam/{jam.id}" class="no-link">
			<h1>
				{jam.title}
			</h1>
		</a>

		<div class="ruler-text">
			<span>submissions</span>
		</div>

		<div class="submissions-container">
			{#each submissions as submission}
				<a href="{getSubmissionLink(submission.id, submission.name)}" class="no-link">
					<div class="submission">
						<div class="image-container">
							{#if submission.has_thumbnail}
								<div class="div-img" style="background-image: url({BASE_URL}/project/{submission.id}/thumbnail.webp)" alt="project"></div>
							{:else}
								<div class="div-img" style="background-image: url(/project-placeholder.webp)" alt="project placeholder"></div>
							{/if}
						</div>
						<div class="submission-info">
							<span class="title">{submission.name}</span>
							<span class="description">{submission.description_short ?? submission.description.slice(0, 100) + "..."}</span>

							<div class="tags-container">
								{#each submission.tags ?? [] as tag}
									<a class="button tag gray" href="/projects?tag={encodeURIComponent(tag)}">{tagToDisplay[tag]}</a>
								{/each}
							</div>
						</div>
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

	.submissions-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.submission {
		display: flex;
		gap: 1rem;
		color: var(--text-color);
		padding: 0.5rem;
	}
	.submission:hover {
		background-color: #555;
		border-radius: 1rem;
	}

	.image-container {
		position: relative;
		display: block;
		width: 15rem;
		height: 9rem;
		overflow: hidden;
		background-color: #111;
		border-radius: 1rem;
	}
	.div-img {
		display: block;
		position: absolute;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.submission-info {
		flex: 1;
	}

	.submission-info .title {
		display: block;
		font-size: 1.5rem;
	}

	.submission-info .description {
		display: block;
		margin-block: 0.5rem;
		color: var(--text-color-medium);
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