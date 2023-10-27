
<svelte:head>
	<title>{project.name} by {project.owner_name}</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{project.name} by {project.owner_name}" />
	<meta property="og:description" content="{project.description_short || project.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta name="description" content="{project.description_short || project.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta name="twitter:description" content="{project.description_short || project.description?.slice(0, 200) || "This project does not yet have a description."}" />
	<meta property="og:url" content="{BASE_URL}{getProjectLink(project.id, project.name)}" />
	<meta property="og:image" content="{project.has_thumbnail ? `${BASE_URL}/project/${project.id}/thumbnail_full.webp` : "/project-placeholder.webp"}" />
	<meta name="keywords" content="{project.name}, {project.owner_name}, {project.keywords}, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { fade } from "svelte/transition";
	import { onMount, onDestroy } from "svelte";
	import { getProjectLink, addToast, tagToDisplay } from "$lib/util.js";
	import { BASE_URL, getMyProfile, reportProjectView, reportProjectDownload, saveProject, checkSavedProject, unsaveProject, likeProject, checkLikedProject, unlikeProject } from "$lib/database.js";
	
	import Markdown from "$lib/Markdown.svelte";
	
	import Modal from "$lib/Modal.svelte";
    import CommentSection from "./CommentSection.svelte";

	export let data;
	let project = data.project;
	let comments = data.comments;
	let myId = null;

	$: if (data) {
		project = data.project;
		comments = data.comments;
	}

	const DESCRIPTION_PLACEHOLDER = `*This project does not have any description set.*\n\nUse the Discord bot to edit your poject with the /editproject command to configure a description.`;

	let copied = false;
	function copyInstall() {
		let temp = document.createElement("input");
		temp.setAttribute("type", "text");
		temp.value = project.install_command && `wget run ${BASE_URL}/d/${project.id}` || "No command";
		document.body.appendChild(temp);

		temp.select();
		document.execCommand("copy");
		document.body.removeChild(temp);

		copied = true;
		addToast("Copied!", "Copied install link.", "info", 3);
	}

	let imageLinks = [];
	$: if (project.media_count) {
		imageLinks = [];
		for (let i = 0; i < project.media_count; i++) {
			imageLinks.push(`${BASE_URL}/project/${project.id}/image_${i}.webp`);
		}
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

	function downloadLinkOpened() {
		reportProjectDownload(project.id);
	}

	let loginModalOpen = false;

	let liked = false;
	async function likeButton() {
		liked = !liked;
		if (liked) {
			let res = await likeProject(project.id);
			if (res.success)
				addToast("Liked!", "You have liked this project.", "success", 3);
			else
				addToast("Failed!", "Failed to like project. Error: " + (res.error ?? "no error"), "error");
		} else {
			let res = await unlikeProject(project.id);
			if (res.success)
				addToast("Unliked!", "Your like has been removed.", "success", 3);
			else
				addToast("Failed!", "Failed to unlike project. Error: " + (res.error ?? "no error"), "error");
		}
	}

	let saved = false;
	async function saveButton() {
		saved = !saved;
		if (saved) {
			let res = await saveProject(project.id);
			if (res.success)
				addToast("Saved!", "You have saved this project.", "success", 3);
			else
				addToast("Failed!", "Failed to save project. Error: " + (res.error ?? "no error"), "error");
		} else {
			let res = await unsaveProject(project.id);
			if (res.success)
				addToast("Unsaved!", "You no longer have this project saved.", "success", 3);
			else
				addToast("Failed!", "Failed to unsave project. Error: " + (res.error ?? "no error"), "error");
		}
	}

	onMount(async () => {
		setTimeout(reportProjectView, 3000, project.id); // report a view if the page is open for at least 3 seconds
		let profileData = await getMyProfile();
		myId = profileData?.user?.discord_id;
		if (myId != null) {
			let likeData = await checkLikedProject(project.id);
			liked = likeData.liked;
			let savedData = await checkSavedProject(project.id);
			saved = savedData.saved;
		}
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

		<div class="top-buttons">
			{#if myId == null}
				<button class="button" on:click|preventDefault={() => { loginModalOpen = true; }}>
					<i class="fa-regular fa-star"></i>
					Save
				</button>
				<button class="button" on:click|preventDefault={() => { loginModalOpen = true; }}>
					<i class="fa-regular fa-heart"></i>
					Like
				</button>
			{:else if project.owner_discord == myId}
				<a class="button" href="/profile/edit/{project.id}">
					<i class="fa-solid fa-pencil"></i>
					Edit project
				</a>
			{:else}
				{#if saved}
					<button class="button gray" on:click|preventDefault={saveButton}>
						<i class="fa-solid fa-star"></i>
						Saved
					</button>
				{:else}
					<button class="button" on:click|preventDefault={saveButton}>
						<i class="fa-regular fa-star"></i>
						Save
					</button>
				{/if}

				{#if liked}
					<button class="button gray" on:click|preventDefault={likeButton}>
						<i class="fa-solid fa-heart"></i>
						Liked
					</button>
				{:else}
					<button class="button" on:click|preventDefault={likeButton}>
						<i class="fa-regular fa-heart"></i>
						Like
					</button>
				{/if}
			{/if}
		</div>

		<div class="top-info">
			<span class="total-downloads">{project.downloads} {project.downloads == 1 ? "download" : "downloads"}</span>
			<span class="total-views">{project.views} {project.views == 1 ? "view" : "views"}</span>
			<span class="total-likes">{project.likes} {project.likes == 1 ? "like" : "likes"}</span>
			<span class="project-date">{projectDate}</span>
		</div>

		<a href="/user/{project.owner_discord}"><img class="pfp" src="{BASE_URL}/pfp/{project.owner_discord}.png" alt="profile"></a>

		<h1>
			{project.name}
			<span class="subheader">by <a href="/user/{project.owner_discord}">{project.owner_name}</a></span>
		</h1>

		<div class="tags-container">
			{#each project.tags?.split(",") ?? [] as tag}
				<a class="button tag gray" href="/projects?tag={encodeURIComponent(tag)}">{tagToDisplay[tag]}</a>
			{/each}
		</div>

		<div id="description" class="markdown-container">
			{#if !project.hide_thumbnail}
				{#if project.has_thumbnail}
					<img class="project-image shadow" src="{BASE_URL}/project/{project.id}/thumbnail_full.webp" alt="project thumbnail">
				{:else}
					<img class="project-image shadow" src="/project-placeholder.webp" alt="project thumbnail">
				{/if}
			{/if}
			
			{#if project.description_markdown}
				<Markdown source={project.description_markdown} />
			{:else if project.description}
				<Markdown source={project.description} />
			{:else}
				<Markdown source={DESCRIPTION_PLACEHOLDER} />
			{/if}
		</div>

		<div id="sources">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			{#if project.install_command || !project.download_url}
				<pre type="text" class="command" class:copied={copied} on:click={copyInstall}>{#if copied}<i id="copiedText" in:fade="{{ duration: 100 }}">Copied!</i>{/if}{project.install_command ? `wget run ${BASE_URL}/d/${project.id}` : "no install command"}<i id="copyInstallButton" class="fas fa-copy"></i></pre>
			{/if}
			{#if project.download_url}
				<a on:click={downloadLinkOpened} target="_blank" rel="noreferrer" class="button green" href="{project.download_url}">Download <i style="margin-left:0.5rem;" class="fa-solid fa-download"></i></a>
			{/if}
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

		<CommentSection {project} {comments} {myId} />
	</div>
</div>

<Modal title="Login" bind:opened={loginModalOpen}>
	<p>To save and follow projects, you need to be logged in on the site.</p>
	<a href="https://discord.com/api/oauth2/authorize?client_id=1073728324142116948&redirect_uri=https%3A%2F%2Fpinestore.cc%2Fdiscordauth&response_type=code&scope=identify" class="modal-button button">
		<i class="fa-brands fa-discord"></i>
		Login with Discord
	</a>
</Modal>

{#if viewImgSrc}
	<div id="imageViewBg"></div>
	<img id="imageView" src={viewImgSrc} alt="screenshot viewer" on:wheel={scrolled}>
{/if}

<svelte:window on:keydown={keypressed} on:click={closeImgView}/>

<style>
	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
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
	.total-likes {
		position: absolute;
		top: 2.5rem;
		color: var(--text-color-dark);
		padding-left: 0.25rem;
	}
	.total-views {
		position: absolute;
		top: 1.25rem;
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

	.top-buttons {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
		position: absolute;
		z-index: 10;
		left: 50%;
		transform: translateX(-50%);
	}
	.top-buttons > * {
		font-size: 1rem;
		border-radius: 10rem;
		text-align: center;
		min-width: 9rem;
	}
	.top-buttons > * i {
		margin-right: 0.5rem;
	}
	@media screen and (max-width: 32rem) {
		.top-buttons {
			position: relative;
			width: 100%;
			margin-bottom: 1rem;
			box-sizing: border-box;
		}
		.top-buttons > * {
			flex: 1;
			min-width: 10rem;
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

	.tags-container {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		font-size: 1rem;
		padding: 0.25rem 0.75rem;
	}

	#description {
		overflow: hidden;
		padding: 1.5rem;
		margin: -1.5rem;
		margin-top: 0;
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

	.modal-button {
		display: block;
		box-sizing: border-box;
		width: 100%;
		text-align: center;
	}
	.modal-button > i {
		margin-right: 0.5em;
	}
</style>