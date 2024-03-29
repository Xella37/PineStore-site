
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
    import ProjectList from "$lib/svelte/ProjectList.svelte";

	export let data;

	let recentProjects = data.projects.sort((a, b) => {
		return b.date_publish - a.date_publish;
	}).slice(0, 3);

	let now = Date.now();
	function calcNewHotScore(project) {
		let daysSincePublish = (now - project.date_publish) / 1000 / 60 / 60 / 24;
		let timeMultiplier = (Math.atan(10 - 0.2*daysSincePublish) / Math.PI + 0.5) ** 1;

		let scoreDownloads = project.downloads_recent * 1;
		let scoreViews = project.views_recent * 0.2;

		let score = (scoreDownloads + scoreViews) * timeMultiplier;
		return score;
	}
	let newHotProjects = data.projects.sort((a, b) => {
		return calcNewHotScore(b) - calcNewHotScore(a);
	}).slice(0, 6);

	let popularProjects = data.projects.sort((a, b) => {
		let dDownloadsRecent = b.downloads_recent - a.downloads_recent;
		if (dDownloadsRecent != 0) return dDownloadsRecent;
		let dDownloads = b.downloads - a.downloads;
		if (dDownloads != 0) return dDownloads;
		let dPublish = b.date_publish - a.date_publish;
		return dPublish;
	}).slice(0, 6);

	let rotateLogo = false;
	function startRotation() {
		rotateLogo = false; // Wait for a moment to allow the class to update after setting to false. Makes sure the animation reset
		setTimeout(() => {
			rotateLogo = true;
		}, 1);
	}
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page shadow">
		<div class="splash">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img src="/pinestore_cropped.webp" width="128" height="128" alt="store logo" on:click={startRotation} class:rotate={rotateLogo}>
			<h1>Welcome to Xella's PineStore!</h1>
			<p>Easily <a href="/faq">add your ComputerCraft projects</a>, <a href="/projects">browse the tags</a> to check out already uploaded projects and use <a href="/documentation">the API</a> to create your own applications with access to the database!</p>
			<p>Create a CC app to easily install these projects, for e.g. embedding in an OS! Finally, make sure to join <a href="https://discord.gg/sNhyBjGez5">our Discord</a>!</p>
			<!-- <p>Use the simple CC app, or modify it, embed it into an OS or create your own frontend to easily install projects in Minecraft!</p> -->
			<!-- <span>Try it out in CC</span>
			<pre class="command">pastebin get yhYuX1fw pinestoreConsole</pre> -->
		</div>

		<a href="/projects?sort=recent_published" class="no-link">
			<h2>Recently Published <i class="fa-solid fa-caret-right"></i></h2>
		</a>
		<ProjectList projects={recentProjects} blocks={true} />

		<h2>New and Hot <i class="fa-solid fa-bolt"></i></h2>
		<ProjectList projects={newHotProjects} blocks={true} />

		<a href="/projects" class="no-link">
			<h2>Most Popular <i class="fa-solid fa-caret-right"></i></h2>
		</a>
		<ProjectList projects={popularProjects} blocks={true} />
	</div>
</div>

<style>
	.splash {
		position: relative;
		display: block;
		margin: auto;
		max-width: 45rem;
		padding-left: 10rem;
		margin-bottom: 2rem;
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

	h2 {
		margin-top: 3rem;
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
		}
		.splash > img.rotate {
			animation: rotation ease 500ms;
		}
	}
</style>
