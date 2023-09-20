
<script>
	import { tags } from "$lib/util.js";

	// uses an array "selectedTags" if specified and bound, only selects one if this is null
	export let selectedTags = null;
	export let selectedTag = null;

	function selectTag(id) {
		if (selectedTags != null) {
			if (selectedTags.includes(id))
				selectedTags = selectedTags.filter(t => t != id);
			else
				selectedTags = [id, ...selectedTags];

			return;
		}

		if (id == selectedTag)
			selectedTag = null;
		else
			selectedTag = id;
	}
</script>

<div class="flex-list margin-medium">
	{#each tags as tag}
		<button class="tag-link shadow" class:selected={selectedTag == tag.id || selectedTags?.includes(tag.id)} on:click={() => { selectTag(tag.id); }}>
			<span>{tag.display}</span>
		</button>
	{/each}
</div>

<style>
	.flex-list {
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem 1rem;
	}
	.flex-list > * {
		flex-basis: unset;
		flex-grow: unset;
	}

	.tag-link {
		border-radius: 10rem;
		overflow: hidden;
		background-color: #444;
		padding: 0.5rem 2rem;
		color: white;
		transition: all ease 100ms;
		border: none;
		cursor: pointer;
	}
	.tag-link span {
		display: block;
		text-align: center;
		font-size: 1.25rem;
		white-space: nowrap;
	}
	.tag-link.selected {
		background-color: var(--cc-blue);
	}
</style>