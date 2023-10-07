
<script>
	import { getProjectLink } from "$lib/util.js";
	import { BASE_URL } from "$lib/database.js";

	export let projects;
	export let blocks = false;
</script>

<div class="flex-list" class:flex-blocks={blocks}>
	{#each projects as project}
		<a href="{getProjectLink(project.id, project.name)}">
			<div class="project-tile shadow">
				<span class="name">{project.name}</span>
				<span class="author">by {project.owner_name}</span>
				<div class="image-container">
					<span class="downloads"><i class="fa-solid fa-download"></i> {project.downloads}</span>
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
		margin-top: 0.75rem;
	}
	.project-tile span.author {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 1.25rem;
		color: var(--text-color-dark);
		margin-bottom: 0.75rem;
	}
	.project-tile .image-container {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 58% 0 0 0;
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
	.project-tile span.downloads {
		position: absolute;
		z-index: 10;
		top: -1px;
		right: 0;
		color: var(--text-color);
		background-color: #444;
		padding: 0.5rem 1rem;
		border-bottom-left-radius: 1rem;
	}
	.project-tile span.downloads i {
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