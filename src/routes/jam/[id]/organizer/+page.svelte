
<svelte:head>
	<title>Organizer Overview</title>
</svelte:head>

<script>
	import { getProjectLink, addToast } from "$lib/util.js";
	import { BASE_URL, getJamScores, getUser } from "$lib/database.js";
    import { onMount } from "svelte";
	
	export let data;
	let jam = data.jam;
	let scores = [];
	let judgeScores = {};

	$: if (data) {
		jam = data.jam;
		console.log(jam)
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

	onMount(async () => {
		let res = await getJamScores(jam.id);
		if (res.success) {
			scores = res.scores;
			console.log(scores);

			let judgeScoresNew = {};
			for (const judge_id of jam.judges) {
				let userData = await getUser(judge_id);
				judgeScoresNew[judge_id] = {
					name: userData.user.name,
					scores: [],
				};
			}

			for (const score of scores) {
				judgeScoresNew[score.user_discord].scores.push({
					comment: score.comment,
					project_id: score.project_id,
					scores: score.scores,
				});
			}

			judgeScores = judgeScoresNew;
			console.log(judgeScores)
		}
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>Organizer Overview {jam.title}</h1>

		<h2>Judging</h2>

		<div class="judges">
			{#each Object.entries(judgeScores) as [judge_id, judgeData]}
				<div class="judge">
					<img src={`${BASE_URL}/pfp/${judge_id}.png`} alt={judgeData.name} on:error={e => e.target.src = "/pfp-placeholder.png"}>
					<span class="judge-name">{judgeData.name}</span>
					<div class="judge-progress-container">
						<div class="judge-progress-bar" style="width: {Math.round((judgeData.scores.length / jam.submission_count) * 100)}%"></div>
						<span class="judge-progress-percentage">{Math.round((judgeData.scores.length / jam.submission_count) * 100)}%</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="judge-scores">
			{#each Object.entries(judgeScores) as [judge_id, judgeData]}
				<div class="judge-score">
					<h3>{judgeData.name}</h3>
					<ul>
						{#each judgeData.scores as score}
							<li>
								<a href={score.submission}>{score.project_id}</a>: {score.comment}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.judges {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
		margin-block: 2rem;
	}
	.judge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.judge img {
		border-radius: 100%;
		max-width: 6rem;
	}
	.judge-name {
		color: var(--text-color-medium);
	}
	.judge-progress-container {
		position: relative;
		width: 100%;
		background-color: var(--cc-gray);
		height: 2rem;
		border-radius: 1rem;
		overflow: hidden;
	}
	.judge-progress-bar {
		background-color: var(--cc-green);
		height: 100%;
	}
	.judge-progress-percentage {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		z-index: 100;
		font-size: 1.5rem;
	}

	.judge-scores {

	}
	.judge-score {

	}
</style>