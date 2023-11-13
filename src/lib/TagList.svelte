
<script>
	import { tags } from "$lib/util.js";

	// uses an array "selectedTags" if specified and bound, only selects one if this is null
	export let selectedTags = null;
	export let selectedTag = null;
	export let hideSaved = false;

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

<div class="flex-list margin-small">
	{#each tags as tag}
		{#if !hideSaved || tag.id != "saved"}
			<button class="tag-link shadow" class:selected={selectedTag == tag.id || selectedTags?.includes(tag.id)} on:click|preventDefault={() => { selectTag(tag.id); }}>
				<span>
					{#if tag.id == "saved"}
						<i class="tag-icon fa-solid fa-star"></i>
					{/if}
					{tag.display}
				</span>
			</button>
		{/if}
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

	.tag-icon {
		margin-right: 0.25em;
		margin-left: -0.25em;
	}

	.tag-link {
		border-radius: 10rem;
		overflow: hidden;
		background-color: #444;
		padding: 0.5rem 1.75rem;
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
	@media screen and (max-width: 40rem) {
		.tag-link {
			padding-inline: 1rem;
		}
		.tag-link span {
			font-size: 1.25em;
		}
	}
</style>