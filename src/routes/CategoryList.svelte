
<script>
	export let selectedCategory = "";
</script>

<div class="flex-list margin-medium">
	<a class="no-link" href="/projects">
		<div class="category-link shadow" class:selected={selectedCategory == "all"}>
			<i class="fa-solid fa-earth-africa"></i>
			<span>All</span>
		</div>
	</a>
	<a class="no-link" href="/projects/fun">
		<div class="category-link shadow" class:selected={selectedCategory == "fun"}>
			<i class="fa-solid fa-gamepad"></i>
			<span>Fun</span>
		</div>
	</a>
	<a class="no-link" href="/projects/tools">
		<div class="category-link shadow" class:selected={selectedCategory == "tools"}>
			<i class="fa-solid fa-wrench"></i>
			<span>Tools</span>
		</div>
	</a>
	<a class="no-link" href="/projects/turtle">
		<div class="category-link shadow" class:selected={selectedCategory == "turtle"}>
			<i class="fa-solid fa-gears"></i>
			<span>Turtle</span>
		</div>
	</a>
	<a class="no-link" href="/projects/audio">
		<div class="category-link shadow" class:selected={selectedCategory == "audio"}>
			<i class="fa-solid fa-volume-low"></i>
			<span>Audio</span>
		</div>
	</a>
	<a class="no-link" href="/projects/other">
		<div class="category-link shadow" class:selected={selectedCategory == "other"}>
			<i class="fa-solid fa-bolt"></i>
			<span>Other</span>
		</div>
	</a>
</div>

<style>
	.category-link {
		border-radius: 1rem;
		overflow: hidden;
		background-color: #444;
		min-width: 7rem;
		padding: 1rem;
		color: white;
		transition: all ease 100ms;
	}
	.category-link:hover {
		background-color: #555;
		color: #DEDE6C;
	}
	.category-link i {
		display: block;
		text-align: center;
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	.category-link span {
		display: block;
		text-align: center;
		font-size: 1.25rem;
	}

	.category-link.selected {
		background-color: var(--cc-blue);
	}

	@media (max-width: 50rem) {
		.flex-list {
			justify-content: center;
		}
		.flex-list > * {
			min-width: calc(49% - 1rem);
			max-width: calc(50% - 1rem);
		}

		.category-link {
			min-width: unset;
		}
	}
</style>