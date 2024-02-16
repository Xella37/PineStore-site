
<script>
	import { getProjectLink } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";

	export let projects;
	export let blocks = false;
</script>

<div class="flex-list" class:flex-blocks={blocks}>
	{#each projects as project}
		<a href="{getProjectLink(project.id, project.name)}" class="no-link">
			<div class="project-tile shadow">
				<span class="name">{project.name}</span>
				<span class="author">by {project.owner_name}</span>
				<div class="ribbon">
					<span><i class="fa-solid fa-download"></i> {project.downloads}</span>
					<span><i class="fa-regular fa-heart"></i> {project.likes}</span>
					<span><i class="fa-regular fa-comment-dots"></i> {project.comment_count}</span>
				</div>
				<div class="image-container">
					{#if project.has_thumbnail}
						<div class="div-img" style="background-image: url({BASE_URL}/project/{project.id}/thumbnail.webp)" alt="project"></div>
					{:else}
						<div class="div-img" style="background-image: url(/project-placeholder.webp)" alt="project placeholder"></div>
					{/if}
				</div>
			</div>
		</a>
	{/each}
</div>

<style>
	.flex-blocks > * {
		min-width: calc(32% - 1rem);
		max-width: calc(33% - 1rem);
	}

	.project-tile {
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
		background-color: #444;
		height: 100%;
		color: white;
		transition: transform ease 100ms;
	}
	.project-tile:hover {
		transform: translateY(-0.5rem);
	}
	.project-tile span.name {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: -0.25rem;

		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		padding-inline: 1rem;
		box-sizing: border-box;
	}
	.project-tile span.author {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 1.25rem;
		color: var(--text-color-dark);
		margin-bottom: 0.5rem;
	}
	.project-tile .image-container {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 56% 0 0 0;
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
	.ribbon {
		display: flex;
		justify-content: space-evenly;
		background-color: #555;
		font-size: 0.85rem;
	}
	.ribbon span {
		color: var(--text-color);
		padding: 0.5rem;
	}
	.ribbon span i {
		margin-right: 0.5rem;
		color: var(--text-color-dark);
	}

	@media (max-width: 50rem) {
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
	}
</style>