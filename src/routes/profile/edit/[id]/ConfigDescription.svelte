<script>
	import Markdown from "$lib/svelte/Markdown.svelte";

	export let project;
	
	let selectedDescription = "main";
</script>

<div class="flex-list tabs">
	<button class="button" class:gray={selectedDescription != "short"} on:click|preventDefault={() => { selectedDescription = "short" }}>
		Short (optional)
	</button>
	<button class="button" class:gray={selectedDescription != "main"} on:click|preventDefault={() => { selectedDescription = "main" }}>
		Main
	</button>
	<button class="button" class:gray={selectedDescription != "markdown"} on:click|preventDefault={() => { selectedDescription = "markdown" }}>
		Markdown (optional)
	</button>
</div>

<div class="tab-container form-list" class:selected={selectedDescription == "short"}>
	<label for="descriptionShortInput">Description Short. Used for meta tags and short text for PineStore clients. Try to keep this under ~150 characters.</label>
	<textarea id="descriptionShortInput" type="text" bind:value={project.description_short} maxlength="200" placeholder="Short description, under ~150 characters"></textarea>

	<div class="char-count" class:over-limit={project.description_short?.length > 150}>{project.description_short?.length ?? 0} chars</div>
</div>

<div class="tab-container form-list" class:selected={selectedDescription == "main"}>
	<label for="descriptionInput">Description Main, for PineStore clients. Also used as fallback for short (truncated) and markdown description.</label>
	<textarea id="descriptionInput" type="text" bind:value={project.description} maxlength="3000" placeholder="Main description, no markup"></textarea>
</div>

<div class="tab-container form-list" class:selected={selectedDescription == "markdown"}>
	<div class="flex-list">
		<div class="form-list markdown-input-section">
			<label for="descriptionMDInput">Description Markdown. Used on the PineStore page in the browser and other markdown supporting software.</label>
			<textarea id="descriptionMDInput" bind:value={project.description_markdown} maxlength="3500" placeholder="Main description in Markdown"></textarea>
		</div>
		
		<div class="form-list">
			<label for="descriptionPreview">Preview</label>
			<div id="descriptionPreview" class="markdown-container">
				<Markdown source={project.description_markdown ?? ""} />
			</div>
		</div>
	</div>
</div>

<style>
	.tab-container {
		position: relative;
		display: none;
		margin-top: 1rem;
	}
	.tab-container.selected {
		display: block;
	}
	.tab-container textarea {
		min-height: 20rem;
	}

	.markdown-container {
		border: 1px solid var(--cc-lightGray);
		padding: 1rem;
	}

	.markdown-input-section {
		display: flex;
		flex-direction: column;
	}
	.markdown-input-section textarea {
		flex-grow: 1;
		margin-top: 0;
		font-size: 1rem;
	}

	.char-count {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		padding: 0.5rem 1rem;
		background-color: var(--cc-lightBlue);
		margin: 0;
		border-radius: 1rem;
		color: black;
	}
	.char-count.over-limit {
		background-color: var(--cc-red);
		color: white;
		font-weight: bold;
		font-size: 1.25rem;
	}

	@media (max-width: 600px) {
		.tabs {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>