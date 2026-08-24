<script>
	import { BASE_URL, searchUsers, getUser } from "$lib/database.js";
	import { addToast } from "$lib/util.js";

	export let project;
	
	let coOwners = [];

	let loaded = false;
	async function load() {
		if (loaded)
			return;

		let currentCoOwners = []
		for (const id of project.co_owner_ids) {
			if (id.length <= 0)
				continue;
			let coOwnerRes = await getUser(id);
			currentCoOwners.push(coOwnerRes.user);
			currentCoOwners = currentCoOwners;
		}
		coOwners = currentCoOwners;

		loaded = true;
	}
	
	$: if (project.co_owner_ids != null) {
		load();
	}

	let coOwnerSearchText = "";
	let coOwnerSearchResults = [];
	let lastSearchInput = Date.now();
	async function runCoOwnerSearch() {
		let now = Date.now();
		lastSearchInput = now;
		setTimeout(async () => {
			if (lastSearchInput != now)
				return;
	
			if (coOwnerSearchText.length <= 0) {
				coOwnerSearchResults = [];
				return;
			}

			let results = await searchUsers(coOwnerSearchText);
			if (results.success)
				coOwnerSearchResults = results.users.filter(user => user.discord_id != project.owner_discord).slice(0, 5);
		}, 250);
	}
	let displayCoOwnerSearchResults = false;
	function coOwnerSearchFocus() {
		displayCoOwnerSearchResults = true;
	}
	function coOwnerSearchBlur(e) {
		setTimeout(() => {
			displayCoOwnerSearchResults = false;
		}, 150);
	}
	function addCoOwner(result) {
		displayCoOwnerSearchResults = false;
		if (coOwners.find(user => user.discord_id == result.discord_id))
			return addToast("Failed!", "Co-owner already in the list.");

		coOwners.push(result);
		coOwners = coOwners;
		project.co_owner_ids = coOwners.map(user => user.discord_id);
	}
	function removeCoOwner(coOwner) {
		coOwners = coOwners.filter(user => user.discord_id != coOwner.discord_id);
		project.co_owner_ids = coOwners.map(user => user.discord_id);
	}
</script>

<div class="cols">
	<div class="col form-list">
		<label for="coOwnerSearch">Co-owners</label>
		<div class="co-owner-list">
			{#each coOwners as coOwner}
				<div class="co-owner">
					<img class="pfp" src="{BASE_URL}/pfp/{coOwner.discord_id}.png" alt="profile">
					<span>{coOwner.name}</span>
					<button class="remove" on:click|preventDefault={() => { removeCoOwner(coOwner); }}>
						<i class="fa-solid fa-xmark"></i>
					</button>
				</div>
			{/each}
			{#if coOwners.length <= 0}
				<span class="empty-message">No co-owners.</span>
			{/if}
		</div>
	</div>
	<div class="col form-list">
		<label for="coOwnerSearch">Add co-owner</label>
		<div class="co-owner-search-group">
			<i class="search-icon fa-solid fa-magnifying-glass"></i>
			<input id="coOwnerSearch" type="text" placeholder="Search" on:focus={coOwnerSearchFocus} on:blur={coOwnerSearchBlur} on:input={runCoOwnerSearch} bind:value={coOwnerSearchText}>
			{#if displayCoOwnerSearchResults && coOwnerSearchText.length > 0}
				<div class="search-results">
					{#each coOwnerSearchResults as result}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="search-result" on:click={() => { addCoOwner(result); }}>
							<img class="pfp" src="{BASE_URL}/pfp/{result.discord_id}.png" alt="profile">
							<span>{result.name}</span>
							<i class="fa-solid fa-plus"></i>
						</div>
					{/each}
					{#if coOwnerSearchResults.length <= 0}
						<span class="empty-message">No results.</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.co-owner-search-group {
		position: relative;
	}
	.co-owner-search-group .search-icon {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		font-size: 1.5rem;
		color: var(--text-color-medium);
		pointer-events: none;
	}
	.co-owner-list {
		position: relative;
		background-color: #222;
		min-height: 0.5rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem;
	}
	.co-owner {
		position: relative;
		padding: 0.75rem;
		padding-left: 3.5rem;
		padding-right: 3.5rem;
		background-color: var(--cc-gray);
		border-radius: 4rem;
	}
	.co-owner img {
		position: absolute;
		width: 2rem;
		height: 2rem;
		top: 50%;
		left: 0.5rem;
		border-radius: 8rem;
		transform: translateY(-50%);
	}
	.co-owner span {
		font-size: 1.125rem;
	}
	.co-owner .remove {
		position: absolute;
		top: 50%;
		right: 0.5rem;
		transform: translateY(-50%);
		background: none;
		background-color: var(--cc-red);
		color: white;
		border: none;
		border-radius: 1rem;
		width: 2rem;
		height: 2rem;
		transition: all ease 100ms;
	}
	.co-owner .remove:hover {
		background-color: var(--cc-orange);
		cursor: pointer;
		color: black;
	}
	.co-owner .remove i {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 1.125rem;
	}
	.search-results {
		position: absolute;
		z-index: 5;
		bottom: 0;
		left: 1rem;
		box-sizing: border-box;
		width: calc(100% - 2rem);
		max-width: 25rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		background-color: var(--cc-gray);
		padding: 1rem;
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
		transform: translateY(100%);
	}
	.search-result {
		position: relative;
		padding: 0.5rem;
		padding-left: 3.5rem;
		padding-right: 2.5rem;
		border-radius: 1rem;
		transition: all ease 100ms;
	}
	.search-result:hover {
		cursor: pointer;
		background-color: #666;
	}
	.search-result img {
		position: absolute;
		top: 50%;
		left: 0.5rem;
		width: 2rem;
		height: 2rem;
		border-radius: 8rem;
		transform: translateY(-50%);
	}
	.search-result span {
		font-size: 1.5rem;
		display: block;
	}
	.search-result i {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		color: var(--cc-lime);
		opacity: 0;
		transition: ease all 100ms;
	}
	.search-result:hover i {
		opacity: 1;
	}
</style>