
<script>
	import { getProjectLink } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";
	import Markdown from "$lib/svelte/Markdown.svelte";
    import TagsDisplay from "$lib/svelte/TagsDisplay.svelte";

	export let project;

	let imageLinks = [];
	$: if (project) {
		imageLinks = [];
		for (let i = 0; i < project.media_count; i++) {
			imageLinks.push(`${BASE_URL}/project/${project.id}/image_${i}.webp`);
		}
	}
</script>

<div class="project">
	<div class="media-area">
		<div class="thumbnail-container">
			{#if project.has_thumbnail}
				<img src="{BASE_URL}/project/{project.id}/thumbnail_full.webp" alt="project">
			{:else}
				<img src="/project-placeholder.webp" alt="project placeholder">
			{/if}
		</div>
		<div class="media-other">
			{#each imageLinks as link}
				<!-- <div class="div-img" style="background-image: url({link})" alt="project media"></div> -->
				<img src="{link}" alt="project media">
			{/each}
		</div>
	</div>
	<div class="info-area">
		<a href="{getProjectLink(project.id, project.name)}" target="_blank">
			<span class="name">
				{project.name}
				<i class="fa-solid fa-arrow-up-right-from-square"></i>
			</span>
		</a>
		<span class="author">by {project.owner_name}</span>
		<TagsDisplay project={project} />
		<div class="description-container">
			<div class="description">
				<Markdown source={project.description_markdown ?? project.description} />
			</div>
		</div>
		<div class="stats-container">
			<div><span class="number">{project.downloads}</span> downloads</div>
			<div><span class="number">{project.likes}</span> likes</div>
			<div><span class="number">{project.comment_count}</span> comments</div>
		</div>
	</div>
</div>

<style>
	.project {
		background-color: #222;
		margin-inline: -2rem;
		padding: 2rem;
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}

	.media-area {
		flex: 3;
		max-width: 55%;
	}

	.thumbnail-container {
		position: relative;
		width: 100%;
	}

	.thumbnail-container img {
		width: 100%;
		border-radius: 0.5rem;
	}

	.media-other {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		overflow-x: auto;
		max-width: 100%;
	}

	.media-other img {
		max-height: 8rem;
		border-radius: 0.5rem;
	}

	.info-area {
		flex: 2;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.info-area .name {
		font-size: 2.5rem;
	}
	.info-area .name i {
		margin-left: 0.5em;
	}

	.info-area .author {
		font-size: 1.5rem;
		color: var(--text-color-medium);
	}

	.description-container {
		position: relative;
		flex: 1;
		background-color: #333;
		border-radius: 0.5rem;
	}
	.description {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		padding: 1rem;
		box-sizing: border-box;
	}

	.stats-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: space-evenly;
		color: var(--text-color-dark);
		margin-top: 1rem;
	}
	.stats-container .number {
		margin-right: 0.5rem;
		color: var(--text-color-medium);
	}
</style>