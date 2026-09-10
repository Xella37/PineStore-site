
<script>
	import { tagToDisplay } from "$lib/util.js";

	export let jam;
	export let project;
</script>

<div class="tags-container">
	{#if jam}
		<a class="button tag submission" href="/jam/{jam.id}">{jam.title}</a>
	{/if}
	{#each project.tags ?? [] as tag}
		<a class="button tag gray" href="/projects?tag={encodeURIComponent(tag)}">{tagToDisplay[tag]}</a>
	{/each}
</div>

<style>
	.tags-container {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		font-size: 1rem;
		padding: 0.25rem 0.75rem;
	}
	.tag.submission {
		background-color: var(--cc-pink);
		color: black;
	}
</style>