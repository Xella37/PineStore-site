
<svelte:head>
	<title>PineStore</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="PineStore" />
	<meta property="og:description" content="The most flexible store for ComputerCraft software!" />
	<meta name="description" content="The most flexible store for ComputerCraft software!" />
	<meta name="twitter:description" content="The most flexible store for ComputerCraft software!" />
	<meta property="og:url" content="https://pinestore.cc/" />
	<meta property="og:image" content="/pinestore_cropped.png" />
	<meta name="keywords" content="computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import ProjectListScrollable from "$lib/svelte/ProjectListScrollable.svelte";
	import { onMount } from "svelte";
	import JamDisplayBig from "./JamDisplayBig.svelte";
	import SingleProjectDisplay from "./SingleProjectDisplay.svelte";
	import { getMySavedProjects, getMyRecommendedProjects, getMyProfile } from "$lib/database.js";
	import RecentCommentsDisplay from "./RecentCommentsDisplay.svelte";

	export let data;

	let projects = data.projects;
	let mostRecentJam = data.mostRecentJam;
	let recentComments = data.recentComments;

	let recentlyUpdatedProjects = projects.sort((a, b) => {
		return (b.date_updated || b.date_publish) - (a.date_updated || a.date_publish);
	}).slice(0, 24);

	// let now = Date.now();
	// function calcNewHotScore(project) {
	// 	let daysSincePublish = (now - project.date_publish) / 1000 / 60 / 60 / 24;
	// 	let timeMultiplier = (Math.atan(10 - 0.2*daysSincePublish) / Math.PI + 0.5) ** 1;

	// 	let scoreDownloads = project.downloads_recent * 1;
	// 	let scoreViews = project.views_recent * 0.2;

	// 	let score = (scoreDownloads + scoreViews) * timeMultiplier;
	// 	return score;
	// }
	// let newHotProjects = projects.sort((a, b) => {
	// 	return calcNewHotScore(b) - calcNewHotScore(a);
	// }).slice(0, 24);

	let popularProjects = projects.sort((a, b) => {
		let dDownloadsRecent = b.downloads_recent - a.downloads_recent;
		if (dDownloadsRecent != 0) return dDownloadsRecent;
		let dDownloads = b.downloads - a.downloads;
		if (dDownloads != 0) return dDownloads;
		let dPublish = b.date_publish - a.date_publish;
		return dPublish;
	}).slice(0, 24);

	// TODO: In the future should account for visited projects stored locally, and if not, should probably be moved to the backend
	async function computeRecommendationsLocal() {
		const recommendationCount = 24;

		let tagProjectPool = {};

		let popularProjects = projects.sort((a, b) => {
			let dDownloadsRecent = b.downloads_recent - a.downloads_recent;
			if (dDownloadsRecent != 0) return dDownloadsRecent;
			let dDownloads = b.downloads - a.downloads;
			if (dDownloads != 0) return dDownloads;
			let dPublish = b.date_publish - a.date_publish;
			return dPublish;
		}).slice(0, recommendationCount*2);

		popularProjects.forEach(project => {
			for (const tag in project.tags) {
				if (!tagProjectPool[tag])
					tagProjectPool[tag] = [];
				tagProjectPool[tag].push(project);
			}
		});

		let popularTagsFound = Object.keys(tagProjectPool);
		let newRecommended = [];
		let projectIdAddedToPool = {};
		while (newRecommended.length < recommendationCount) {
			for (const tag in popularTagsFound) {
				let projectsWithTag = tagProjectPool[tag];
				if (projectsWithTag.length <= 0)
					continue;

				const randomIndex = Math.floor(Math.random() * projectsWithTag.length);
				const [ project ] = projectsWithTag.splice(randomIndex, 1);
				if (!projectIdAddedToPool[project.id]) {
					newRecommended.push(project);
					projectIdAddedToPool[project.id] = true;
				}
			}
		}

		function shuffle(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		}
		shuffle(newRecommended);

		recommendedProjects = newRecommended.slice(0, recommendationCount);
	}

	let myProfile;

	let recommendedProjects = [];
	onMount(async () => {
		let profileData = getMyProfile();
		let savedProjectsData = getMySavedProjects();

		profileData = await profileData;
		savedProjectsData = await savedProjectsData;

		myProfile = profileData.user;

		if (myProfile) {
			let res = await getMyRecommendedProjects();
			if (res.success && res.projects.length > 0)
				recommendedProjects = res.projects;
			else
				recommendedProjects = await computeRecommendationsLocal();
		} else {
			recommendedProjects = await computeRecommendationsLocal();
		}
	});

	let rotateLogo = false;
	function startRotation() {
		rotateLogo = false; // Wait for a moment to allow the class to update after setting to false. Makes sure the animation reset
		setTimeout(() => {
			rotateLogo = true;
		}, 1);
	}

	// Todo: this duplicate url is hacky and should be removed. Should be replaced by a separate login page that can be linked to (optionally with more login options)
	const loginURL = `https://discord.com/api/oauth2/authorize?client_id=1073728324142116948&redirect_uri=https%3A%2F%2Fpinestore.cc%2Fdiscordauth&response_type=code&scope=identify`;
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-wide shadow">
		<div class="splash">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img src="/pinestore_cropped.webp" width="128" height="128" alt="store logo" on:click={startRotation} class:rotate={rotateLogo}>
			<h1>Welcome to PineStore!</h1>
			<p>Check out cool ComputerCraft creations and add your own do the platform. Easily copy an install command and try stuff out!</p>

			<div class="cta-buttons">
				<a href="https://discord.gg/XNBftfypnX" class="button discord">
					<i class="fa-brands fa-discord"></i>
					Join Discord
				</a>
				<a href="/documentation" class="button gray">
					<i class="fa-solid fa-book"></i>
					API docs
				</a>
				<a href="{myProfile != null ? "/profile?tab=projects" : loginURL}" class="button green">
					<i class="fa-solid fa-plus"></i>
					Add your project
				</a>
			</div>
		</div>

		<h2>Recommended <i class="fa-solid fa-thumbs-up"></i></h2>
		<ProjectListScrollable projects={recommendedProjects} projectsPerPage={4} />

		<!-- Not good enough yet, also not sure how to programatically decide which project to display -->
		<!-- {#if recentProjects[1]}
			<h2>Also check out</h2>
			<SingleProjectDisplay project={recentProjects[1]} />
		{/if} -->

		<a href="/projects?sort=recent_update" class="no-link">
			<h2>Recently published / updated <i class="fa-solid fa-caret-right"></i></h2>
		</a>
		<ProjectListScrollable projects={recentlyUpdatedProjects} projectsPerPage={4} displayTime={true} />

		<!-- Removed for now, recommended kinda took its place -->
		<!-- <h2>New and Hot <i class="fa-solid fa-bolt"></i></h2>
		<ProjectList projects={newHotProjects} blocks={true} /> -->

		<a href="/projects" class="no-link">
			<h2>Most popular <i class="fa-solid fa-caret-right"></i></h2>
		</a>
		<ProjectListScrollable projects={popularProjects} projectsPerPage={5} />

		<!-- Most recent jam -->
		{#if mostRecentJam}
			<h2>Recent jam</h2>
			<div class="recent-jam">
				<JamDisplayBig jam={mostRecentJam} />
			</div>
		{/if}

		<!-- Display recent comments and their projects to show activity there -->
		<h2>Recent activity</h2>
		<RecentCommentsDisplay recentComments={recentComments} />

		<!-- Most recently **UPDATED** projects and their changelogs? -->
	</div>
</div>

<style>
	.splash {
		position: relative;
		display: block;
		margin: auto;
		max-width: 45rem;
		padding-left: 10rem;
		margin-block: 1rem;
	}
	.splash h1{
		margin-top: 0;
	}

	.splash > img {
		position: absolute;
		top: 50%;
		left: 0;
		width: 8rem;
		transform: translateY(-50%);
		cursor: pointer;
	}
	@keyframes rotationCentered {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		25% {
			transform: translateY(-50%) rotate(45deg);
		}
		50% {
			transform: translateY(-50%) rotate(-22deg);
		}
		75% {
			transform: translateY(-50%) rotate(5deg);
		}
		100% {
			transform: translateY(-50%) rotate(0deg);
		}
	}
	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(45deg);
		}
		50% {
			transform: rotate(-22deg);
		}
		75% {
			transform: rotate(5deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
	.splash > img.rotate {
		animation: rotationCentered ease 500ms;
	}
	.cta-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1rem;
	}
	.cta-buttons .discord {
		background-color: #5865F2;
	}
	.cta-buttons .discord:hover {
		background-color: var(--cc-lightBlue);
	}
	@media (max-width: 420px) {
		.cta-buttons {
			flex-direction: column;
		}
	}

	h2 {
		margin-top: 3rem;
	}
	h2 i {
		margin-left: 0.5em;
		color: var(--text-color-medium);
	}

	a h2 {
		transition: all ease 200ms;
	}
	a:hover h2 {
		color: var(--text-color-medium);
	}

	@media screen and (max-width: 40rem) {
		.splash {
			max-width: none;
			padding: 0;
		}

		.splash > img {
			position: relative;
			display: block;
			top: unset;
			left: unset;
			transform: unset;
			margin: auto;
			margin-bottom: 1rem;
		}
		.splash > img.rotate {
			animation: rotation ease 500ms;
		}

		.splash h1 {
			text-align: center;
		}
	}

	.recent-jam {
		padding-left: 2rem;
	}
</style>
