
<script>
	import { getProjectLink, calcTimeAgo } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";
	import { visibleOnce } from "$lib/visibleOnce.js";

	export let projects;
	export let projectsPerPage = 3;

	export let displayTime = false;

	const dummyProject = { dummy: true };
	const dummyPage = [...Array(projectsPerPage)].map(() => dummyProject);

	let pages = [];
	let currentPage = 0;
	let maxSelectedPage = 0;
	let maxVisiblePage = 0;

	function nextPage() {
		if (currentPage < pages.length - 1) {
			currentPage++;
			maxSelectedPage = Math.max(maxSelectedPage, currentPage);
		}
	}
	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}
	function loadPages() {
		pages = [];
		for (let i = 0; i < projects.length; i += projectsPerPage) {
			pages.push(projects.slice(i, i + projectsPerPage));
		}
		currentPage = 0;
	}
	$: if (projects?.length > 0) {
		loadPages();
	}

	function formatTimestamp(timestamp) {
		let dt = Date.now() - timestamp;
		if (dt <= 5000)
			return "just now";
		return `${calcTimeAgo(timestamp, true)}`;
	}
</script>

<div class="projects-container">
	<button class="nav-button left" on:click={prevPage} disabled={currentPage === 0}>
		<i class="fa-solid fa-chevron-left"></i>
	</button>
	<button class="nav-button right" on:click={nextPage} disabled={currentPage === Math.max(0, pages.length - 1)}>
		<i class="fa-solid fa-chevron-right"></i>
	</button>
	<div class="pages-container">
		<div class="project-page dummy-page">
			{#each dummyPage as project, i}
				<div class="project-tile shadow" style="animation-delay: {i*50}ms; opacity: {pages.length > 0 ? 0 : 1}">
					<span class="name">{project.name}</span>
					<span class="author">by {project.owner_name}</span>
					<div class="ribbon-container">
						<div class="ribbon">
							<span><i class="fa-solid fa-download"></i> {project.downloads}</span>
							<span><i class="fa-regular fa-heart"></i> {project.likes}</span>
							<span><i class="fa-regular fa-comment-dots"></i> {project.comment_count}</span>
						</div>
					</div>
					<div class="image-container"></div>
				</div>
			{/each}
		</div>
		{#each pages as page, pageIndex}
			<div class="project-page" style="transform: translateX({(pageIndex - currentPage) * 110}%);" use:visibleOnce={() => {
				maxVisiblePage = Math.max(maxVisiblePage, pageIndex);
			}}>
				{#each page as project, i}
					<a href="{getProjectLink(project.id, project.name)}" class="no-link">
						<div class="project-tile shadow" style="animation-delay: {i*50}ms">
							<span class="name">{project.name}</span>
							<span class="author">by {project.owner_name}</span>
							<div class="ribbon-container">
								<div class="ribbon">
									<span><i class="fa-solid fa-download"></i> {project.downloads}</span>
									<span><i class="fa-regular fa-heart"></i> {project.likes}</span>
									<span><i class="fa-regular fa-comment-dots"></i> {project.comment_count}</span>
								</div>
							</div>
							<div class="image-container">
								{#if maxSelectedPage >= pageIndex-1 || maxVisiblePage >= pageIndex-1}
									{#if project.has_thumbnail}
										<div class="div-img normal" style="background-image: url({BASE_URL}/project/{project.id}/thumbnail.webp)" alt="project"></div>
										<div class="div-img full" style="background-image: url({BASE_URL}/project/{project.id}/thumbnail_full.webp); animation-delay: 200ms" alt="project"></div>
									{:else}
										<div class="div-img" style="background-image: url(/project-placeholder.webp)" alt="project placeholder"></div>
									{/if}
								{/if}

								{#if displayTime}
									<div class="display-time">
										{formatTimestamp(project.date_updated || project.date_publish)}
									</div>
								{/if}
							</div>
						</div>
					</a>
				{/each}
				{#each Array(projectsPerPage - page.length) as emptyProject}
					<div></div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.projects-container {
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		gap: 1rem;
		background-color: #222;
		margin-inline: -2rem;
		min-height: 10rem;
	}
	.pages-container {
		position: relative;
		flex-grow: 1;
		overflow: hidden;
	}
	.project-page {
		padding-block: 4rem;
		position: absolute;
		top: 0;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		flex-wrap: nowrap;
		gap: 2rem;
		width: calc(100% - 8rem);
		transition: transform ease 200ms;
		padding-inline: 4rem;
	}
	.project-page > * {
		min-width: 0;
	}

	.nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: var(--cc-cyan);
		border: none;
		color: white;
		font-size: 2rem;
		z-index: 1;
		border-radius: 4rem;
		width: 4rem;
		height: 4rem;
		cursor: pointer;
		transition: all ease 250ms;
	}
	.nav-button:hover {
		background-color: var(--cc-lightBlue);
	}
	.nav-button:disabled {
		background-color: #333;
		color: var(--cc-gray);
		cursor: not-allowed;
	}
	.nav-button i {
		pointer-events: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.nav-button.left {
		left: -2rem;
	}
	.nav-button.right {
		right: -2rem;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.project-tile {
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
		background-color: #444;
		color: white;
		transition: transform ease 100ms;
		opacity: 0;
		animation: fade-in forwards 200ms;
	}
	.project-tile:hover {
		transform: translateY(-0.5rem);
	}
	.project-tile span.name {
		display: inline-block;
		text-align: center;
		font-size: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: -0.25rem;

		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		padding-inline: 1rem;
		box-sizing: border-box;
		width: 100%;
	}
	.project-tile span.author {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 1.25rem;
		color: var(--text-color-dark);
		margin-bottom: 0.5rem;
		line-height: 1.5rem;

		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		padding-inline: 1rem;
		box-sizing: border-box;
	}
	.project-tile .image-container {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 56% 0 0 0;
		background-color: #111;
	}
	.project-tile .div-img {
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
	.div-img.full {
		display: none;
		opacity: 0;
	}
	.project-tile:hover .div-img.normal {
		/* display: none; */
	}
	.project-tile:hover .div-img.full {
		display: block;
		animation: fade-in forwards 50ms;
	}
	.display-time {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 0.25rem 0.5rem;
		background-color: var(--cc-gray);
		border-top-left-radius: 1rem;
		color: var(--text-color-medium);
	}
	.project-tile:hover .ribbon {
		transform: translateY(0%);
	}
	.ribbon-container {
		position: absolute;
		z-index: 1;
		width: 100%;
		overflow: hidden;
	}
	.ribbon {
		display: flex;
		justify-content: space-evenly;
		background-color: #555;
		font-size: 0.85rem;
		transform: translateY(-100%);
		transition: transform ease 100ms;
	}
	.ribbon span {
		color: var(--text-color);
		padding: 0.5rem;
	}
	.ribbon span i {
		margin-right: 0.5rem;
		color: var(--text-color-dark);
	}
	
	.dummy-page {
		position: relative;
		pointer-events: none;
	}

	@keyframes color {
		to {
			background-color: #333;
		}
	}
	.dummy-page .project-tile {
		animation-name: color;
		animation-duration: 0.25s;
		animation-iteration-count: infinite;
		animation-direction: alternate-reverse;
		animation-timing-function: ease;
	}
	.dummy-page .project-tile  * {
		opacity: 0;
	}

	/* @media (max-width: 50rem) {
		.flex-list > * {
			min-width: calc(49% - 1rem);
			max-width: calc(50% - 1rem);
		}
	}

	@media (max-width: 30rem) {
		.flex-list {
			flex-direction: column;
			flex-wrap: unset;
		}
		.flex-list > * {
			min-width: unset;
			max-width: unset;
		}
	} */
	
	@media (max-width: 1300px) {
		.pages-container {
			overflow-x: auto;
			display: grid;
			grid-auto-flow: column;
			padding-inline: 1rem;
		}
		.project-page {
			position: relative;
			transform: unset!important;
			padding-inline: 1rem;
			/* min-width: 100vw; */
			padding-block: 2rem;
		}
		.project-page > * {
			/* min-width: unset; */
			min-width: 15rem;
		}
		.dummy-page {
			display: none;
		}
		.nav-button {
			display: none;
		}
	}
</style>