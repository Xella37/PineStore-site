
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
	import { getProjectLink, addToast } from "$lib/util.js";
	import { BASE_URL, submitJudgeScore, getMyJudgeScore } from "$lib/database.js";
    import { onMount } from "svelte";
	
	export let data;
	let jam = data.jam;
	let submission = data.submission;

	$: if (data) {
		jam = data.jam;
		submission = data.submission;
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

	let judgeData = {
		comment: "",
		scores: {
			Creativity: "",
			Theme: "",
			Design: "",
			Appeal: "",
		},
	};

	async function submitScores() {
		let scores = judgeData.scores;
		let processedScores = {};
		for (const scoreName in scores) {
			processedScores[scoreName] = parseFloat(scores[scoreName]);
		}

		let res = await submitJudgeScore(jam.id, submission.id, judgeData.comment, processedScores);
		if (res.success)
			addToast("Submitted!", "Your scores have been saved.", "success", 3);
		else
			addToast("Failed!", "Failed to submit judge scores. Error: " + (res.error ?? "no error"), "error");
	}

	let previousScore = null;
	onMount(async () => {
		let res = await getMyJudgeScore(jam.id, submission.id);
		console.log(res);
		if (res.success) {
			previousScore = res.score;
		}
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="jam-info">
			<span>Submitted on {projectDate}</span>
		</div>

		<a href="{getProjectLink(submission.id, submission.name)}" class="no-link">
			<h1>
				{submission.name}
			</h1>
		</a>

		{#if submission.has_thumbnail}
			<img class="project-image shadow" src="{BASE_URL}/project/{submission.id}/thumbnail_full.webp" alt="project thumbnail">
		{:else}
			<img class="project-image shadow" src="/project-placeholder.webp" alt="project thumbnail">
		{/if}

		{#if previousScore != null}
			<p>You have submitted the following scores:</p>

			<p>Comment: {previousScore.comment}</p>
			<ul>
				{#each Object.keys(previousScore.scores) as scoreName}
					<li>
						{scoreName}: {previousScore.scores[scoreName]}
					</li>
				{/each}
			</ul>
		{:else}
			<form on:submit|preventDefault={submitScores}>
				<h3>Judge form</h3>

				<label for="comment">Comment</label>
				<textarea id="comment" type="text" bind:value={judgeData.comment} maxlength="500"></textarea>

				<p>For the scores, please enter any number ranging from 0 to 10, with up to one decimal. Examples: 5, 2, 8, 7.5, 6.2</p>
				<div class="scores">
					{#each Object.keys(judgeData.scores) as scoreName}
						<div>
							<label for={scoreName}>{scoreName}</label>
							<input id="{scoreName}" type="text" bind:value={judgeData.scores[scoreName]}>
						</div>
					{/each}
				</div>

				<p>Submission for the score cannot be undone.</p>

				<button type="submit" class="button">Submit score</button>
			</form>
		{/if}
	</div>
</div>

<style>
	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	h1:hover {
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

	.project-image {
		width: 15rem;
		border-radius: 1rem;
		display: block;
		margin-bottom: 1rem;
		margin-inline: auto;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	label {
		margin-top: 1rem;
	}

	.scores {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.scores > div {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.scores label {
		min-width: 7rem;
	}
	.scores input {
		flex: 1;
		min-width: 7rem;
		max-width: 20rem;
	}
</style>