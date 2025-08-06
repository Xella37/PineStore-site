
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
	let allScores = data.scores_all;

	$: if (data) {
		jam = data.jam;
		submission = data.submission;
		allScores = data.scores_all;
		if (jam.judging_finished) {
			for (let score of allScores) {
				let catScores = score.scores;
				let keys = Object.keys(catScores);
				let sum = 0;
				let count = 0;
				for (const key of keys) {
					if (key != "Final") {
						sum += catScores[key];
						count++;
					}
				}
				catScores["Final"] = (sum / count).toFixed(2);
			}
		}
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

		<div class="pfps">
			<a href="/user/{submission.owner_discord}"><img class="pfp" src="{BASE_URL}/pfp/{submission.owner_discord}.png" alt="profile"></a>
			{#each submission.coOwners as coOwner}
				<a href="/user/{coOwner.discord_id}"><img class="pfp copfp" src="{BASE_URL}/pfp/{coOwner.discord_id}.png" alt="profile"></a>
			{/each}
		</div>

		<a href="{getProjectLink(submission.id, submission.name)}" class="no-link">
			<h2>
				{submission.name}
				<span class="subheader">
					by <a href="/user/{submission.owner_discord}">{submission.owner_name}</a>
					{#each submission.coOwners as coOwner}
						, <a href="/user/{coOwner.discord_id}">{coOwner.name}</a>
					{/each}
				</span>
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

		{#if jam.judging_finished}
			<div class="ruler-text">
				<span>judge results</span>
			</div>

			<div class="judge-scores">
				{#each allScores as judgeScore}
					<div class="judge-score">
						<div class="judge">
							<a href="/user/{judgeScore.user_discord}"><img src="{BASE_URL}/pfp/{judgeScore.user_discord}.png" alt="profile"></a>
							<span class="username">{judgeScore.User.name}</span>
						</div>

						<div class="main">
							<div class="score-list">
								{#each Object.keys(judgeScore.scores) as categoryName}
									<div>
										<span class="name">
											{categoryName}
										</span>
										<span class="value">
											{judgeScore.scores[categoryName]}
										</span>
									</div>
								{/each}
							</div>

							{#if judgeScore.comment != null}
								<span class="comment">
									<i class="fa-solid fa-quote-left"></i>
									{judgeScore.comment}
									<i class="fa-solid fa-quote-right"></i>
								</span>
							{:else}
								<span class="comment">
									<i>No comment</i>
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="ruler-text">
				<span>final scores</span>
			</div>

			<div class="judge-scores">
				<div class="judge-score">
					<div class="main">
						<div class="score-list">
							{#each Object.keys(submission.JamContestant.scores) as categoryName}
								<div>
									<span class="name">
										{categoryName}
									</span>
									<span class="value">
										{#if categoryName == "Final"}
											{submission.JamContestant.scores[categoryName]?.toFixed(2) ?? "No score"}
										{:else}
											{submission.JamContestant.scores[categoryName]}
										{/if}
									</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>			
		{:else if Date.now() < jam.date_end}
			<div class="info-block info">
				<i class="fa-regular fa-clock"></i>
				Judging starts once jam ends
			</div>
		{:else}
			<div class="info-block info">
				<i class="fa-regular fa-clock"></i>
				Judging in progress...
			</div>
		{/if}

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
		word-break: break-word;
		max-width: calc(100% - 4rem);
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
		overflow: hidden;
		padding: 1.5rem;
		margin: -1.5rem;
		margin-top: 0;
		padding-bottom: 0;
	}

	@media screen and (max-width: 45rem) {
		h1 {
			font-size: 2.5rem;
		}
		h2 {
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

	.pfps {
		float: right;
		position: relative;
		top: 1rem;
		width: 12rem;
		display: flex;
		gap: 1rem;
		justify-content: end;
		flex-wrap: wrap;
	}
	.pfps > * {
		max-width: 6rem;
		min-width: 4rem;
		flex: 1;
		flex-grow: 0;
	}
	.pfps:not(:has(.copfp)) > *:first-child {
		flex-grow: 1;
	}
	.pfp {
		border-radius: 100vw;
		max-width: 100%;
	}

	.project-image {
		width: 25rem;
		float: right;
		border-radius: 1rem;
		margin-left: 1rem;
		margin-bottom: 1rem;
	}

	@media screen and (max-width: 45rem) {
		.pfps {
			width: unset;
			max-width: 7rem;
			top: 0rem;
			gap: 0.5rem;
			max-height: 8rem;
			flex-wrap: wrap;
		}
		.pfps > * {
			min-width: 3rem;
			width: 3rem;
		}

		.project-image {
			float: unset;
			width: 100%;
			margin-left: 0;
			margin-bottom: 1.5rem;
		}
	}
	@media screen and (max-width: 30rem) {
		.pfps {
			flex-direction: column;
			flex-wrap: wrap-reverse;
			justify-content: start;
			max-width: unset;
			overflow: inherit;
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

	.info-block {
		margin-top: 3rem;
	}
</style>