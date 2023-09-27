
<svelte:head>
	<title>{project.name} by {project.owner_name}</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{project.name} by {project.owner_name}" />
	<meta property="og:description" content="{project.description_short || project.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta name="description" content="{project.description_short || project.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta name="twitter:description" content="{project.description_short || project.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta property="og:url" content="https://pinestore.cc{getProjectLink(project.id, project.name)}" />
	<meta property="og:image" content="{project.has_thumbnail ? `https://pinestore.cc/project/${project.id}/thumbnail_full.webp` : "/project-placeholder.webp"}" />
	<meta name="keywords" content="{project.name}, {project.owner_name}, {project.keywords}, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { fade } from "svelte/transition";
	import { onMount, onDestroy } from "svelte";
	import { getProjectLink } from "$lib/util.js";
	import { myProfile, reportProjectView } from "$lib/database.js";
	
	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "$lib/MDImage.svelte";
	import MDCode from "$lib/MDCode.svelte";
    import CommentSection from "./CommentSection.svelte";

	export let data;
	let project = data.project;
	let comments = data.comments;
	let myId = null;

	const DESCRIPTION_PLACEHOLDER = `*This project does not have any description set.*\n\nUse the Discord bot to edit your poject with the /editproject command to configure a description.`;

	let copied = false;
	function copyInstall() {
		let temp = document.createElement("input");
		temp.setAttribute("type", "text");
		temp.value = project.install_command && `wget run https://pinestore.cc/d/${project.id}` || "No command";
		document.body.appendChild(temp);

		temp.select();
		document.execCommand("copy");
		document.body.removeChild(temp);

		copied = true;
	}

	let imageLinks = [];
	// $: if (project.screenshot_links) {
	// 	try {
	// 		// let links = JSON.parse(project.screenshot_links);
	// 		let links = project.screenshot_links.split(",");
	// 		if (links.length > 0)
	// 			imageLinks = links;
	// 	} catch(e) {
	// 		console.log(e);
	// 	}
	// }
	for (let i = 0; i < project.media_count; i++) {
		imageLinks.push(`https://pinestore.cc/project/${project.id}/image_${i}.webp`);
	}

	let viewIndex = undefined;
	let viewImgSrc;
	let openedImg = Date.now();
	function viewImg(e) {
		openedImg = Date.now();
		viewIndex = e.target.getAttribute("data-index");
		viewImgSrc = imageLinks[viewIndex];
	}
	function closeImgView(e) {
		if (Date.now() > openedImg + 100)
			viewImgSrc = undefined;
	}
	function keypressed(e) {
		if (viewImgSrc) {
			if (e.key == "ArrowLeft" || e.key == "a") {
				viewIndex = (viewIndex - 1 + imageLinks.length) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			} else if (e.key == "ArrowRight" || e.key == "d") {
				viewIndex = (viewIndex + 1) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			} else {
				if (Date.now() > openedImg + 100)
					viewImgSrc = undefined;
			}
		}
	}
	function scrolled(e) {
		if (viewImgSrc) {
			e.preventDefault();
			if (e.wheelDeltaY > 0) {
				viewIndex = (viewIndex - 1 + imageLinks.length) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			} else if (e.wheelDeltaY < 0) {
				viewIndex = (viewIndex + 1) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			}
		}
	}

	let projectDate = new Date(Math.max(project.date_added, project.date_updated));
	projectDate = projectDate.toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	let timerText = "TIME";
	let showTimer = project.date_release > Date.now() && !(project.install_command?.length > 0);
	if (showTimer) {
		function updateTimerText() {
			let dt = Math.floor((project.date_release - Date.now()) / 1000);
			if (dt < 0) {
				timerText = "0";
				location.reload(true);
			} else if (dt < 60) {
				timerText = dt + " seconds";
			} else if (dt < 60*60) {
				let mins = Math.floor(dt / 60);
				let secs = dt % 60;
				timerText = `${mins}m, ${secs}s`;
			} else if (dt < 60*60*24) {
				dt = Math.floor(dt / 60);
				let hrs = Math.floor(dt / 60);
				let mins = dt % 60;
				timerText = `${hrs}h, ${mins}m`;
			} else {
				dt = Math.floor(dt / 60 / 60 / 24);
				timerText = `${dt} days`;
			}
		}
		updateTimerText();

		let interval;

		function resetInterval() {
			clearInterval(interval);
			interval = setInterval(updateTimerText, 1000);
		}
		onMount(() => {
			resetInterval();
		});
		onDestroy(() => {
			clearInterval(interval);
		});
	}

	onMount(async () => {
		setTimeout(reportProjectView, 3000, project.id); // report a view if the page is open for at least 3 seconds
		let profileData = await myProfile();
		myId = profileData?.user?.discord_id;
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		{#if project.visible == 0}
			<div class="info-block warning">
				<i class="fa-solid fa-triangle-exclamation"></i>
				This project is currently not visible. Set your project to visible once it's ready.
			</div>
		{/if}

		{#if showTimer}
			<div class="info-block info">
				<i class="fa-regular fa-hourglass-half"></i>
				This project will release in {timerText}
			</div>
		{/if}

		{#if myId != null && project.owner_discord == myId}
			<a id="editProjectButton" class="button" href="/profile/edit/{project.id}"><i class="fa-solid fa-pencil"></i> Edit project</a>
		{/if}

		<div class="top-info">
			<span class="total-downloads">{project.downloads} {project.downloads == 1 ? "download" : "downloads"}</span>
			<span class="total-views">{project.views} {project.views == 1 ? "view" : "views"}</span>
			<span class="project-date">{projectDate}</span>
		</div>

		<a href="/user/{project.owner_discord}"><img class="pfp" src="https://pinestore.cc/pfp/{project.owner_discord}.png" alt="profile"></a>

		<h1>
			{project.name}
			<span class="subheader">by <a href="/user/{project.owner_discord}">{project.owner_name}</a></span>
		</h1>

		<div id="description" class="markdown-container">
			{#if project.has_thumbnail}
				<img class="project-image shadow" src="https://pinestore.cc/project/{project.id}/thumbnail_full.webp" alt="project thumbnail">
			{:else}
				<img class="project-image shadow" src="/project-placeholder.webp" alt="project thumbnail">
			{/if}
			
			{#if project.description_markdown}
				<SvelteMarkdown source={project.description_markdown} renderers={{ image: MDImage, code: MDCode }} />
			{:else if project.description}
				<SvelteMarkdown source={project.description} renderers={{ image: MDImage, code: MDCode }} />
			{:else}
				<SvelteMarkdown source={DESCRIPTION_PLACEHOLDER} renderers={{ image: MDImage, code: MDCode }} />
			{/if}
		</div>

		<div id="sources">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<pre type="text" class="command" class:copied={copied} on:click={copyInstall}>{#if copied}<i id="copiedText" in:fade="{{ duration: 100 }}">Copied!</i>{/if}{project.install_command && `wget run https://pinestore.cc/d/${project.id}` || "no install command"}<i id="copyInstallButton" class="fas fa-copy"></i></pre>
			<a target="_blank" rel="noreferrer" class="button" class:disabled="{!project.repository}" href="{project.repository}">Git Repository <i style="margin-left:0.5rem;" class="fa-solid fa-up-right-from-square"></i></a>
		</div>

		{#if imageLinks.length > 0}
			<div id="imagesSection">
				{#each imageLinks as url, i}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<img data-index="{i}" src="{url}" class="shadow" on:click={viewImg} alt="project screenshot">
				{/each}
			</div>
		{/if}

		<div class="ruler-text">
			<span>comments</span>
		</div>

		<CommentSection projectId={project.id} {comments} {myId} />
	</div>
</div>

{#if viewImgSrc}
	<div id="imageViewBg"></div>
	<img id="imageView" src={viewImgSrc} alt="screenshot viewer" on:wheel={scrolled}>
{/if}

<svelte:window on:keydown={keypressed} on:click={closeImgView}/>

<style>
	h1 {
		font-size: 4rem;
		/* margin-top: 4rem; */
	}

	.pfp {
		border-radius: 100vw;
		float: right;
		position: relative;
		top: 3rem;
		width: 6rem;
	}

	.top-info {
		position: relative;
		display: block;
		padding-block: 1rem;
	}
	.total-views {
		position: absolute;
		top: 1.5rem;
		color: var(--text-color-dark);
		padding-left: 0.25rem;
	}
	.total-downloads {
		position: absolute;
		top: 0;
		color: var(--text-color-dark);
		padding-left: 0.25rem;
	}
	.project-date {
		position: absolute;
		top: 0;
		right: 0;
		color: var(--text-color-dark);
	}
	#editProjectButton {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1rem;
		border-radius: 10rem;
		z-index: 10;
	}
	#editProjectButton i {
		margin-right: 0.5rem;
	}
	@media screen and (max-width: 30rem) {
		#editProjectButton {
			position: relative;
			display: block;
			width: 100%;
			margin-bottom: 1rem;
			box-sizing: border-box;
			text-align: center;
		}
	}

	.project-image {
		width: 25rem;
		float: right;
		border-radius: 1rem;
		margin-left: 1rem;
		margin-bottom: 1rem;
	}
	@media screen and (max-width: 45rem) {
		h1 {
			font-size: 2.5rem;
		}

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
	@media screen and (max-width: 30rem) {
		h1 {
			font-size: 1.75rem;
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	}

	#description {
		overflow: hidden;
		padding: 1.5rem;
		margin: -1.5rem;
		padding-bottom: 0;
	}

	#sources {
		margin-top: 3rem;
		width: 100%;
	}
	#sources > * {
		display: block;
		text-align: center;
		margin-bottom: 1rem;
	}

	.command {
		position: relative;
		user-select: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.command:hover {
		cursor: pointer;
		color: grey;
	}

	#copyInstallButton {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: grey;
		pointer-events: none;
	}
	#copiedText {
		color: #57A64E;
		position: absolute;
		left: 1rem;
	}

	@media screen and (max-width: 48rem) {
		#copiedText {
			display: none;
		}
		.command.copied {
			background-color: #3d620d;
		}
		.command.copied #copyInstallButton {
			color: var(--cc-lightGray);
		}
	}
	@media screen and (max-width: 40rem) {
		.command {
			padding-right: 3rem;
		}
	}

	#imagesSection {
		margin-top: 3rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
	}
	#imagesSection img {
		border-radius: 1rem;
		max-width: calc(50% - 0.5rem);
		object-fit: cover;
		cursor: pointer;
	}
	@media (max-width: 40rem) {
		#imagesSection img {
			max-width: 100%;
		}
	}

	#imageView {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		cursor: pointer;
	}
	#imageViewBg {
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.65);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>