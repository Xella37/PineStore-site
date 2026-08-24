<script>
	import { publishProjectUpdate, getChangelogs } from "$lib/database.js";
	import { addToast } from "$lib/util.js";
	
    import Modal from "$lib/svelte/Modal.svelte";
    import ChangeLog from "$lib/svelte/ChangeLog.svelte";

	export let project;

	let changelogs = [];
	async function loadChangelogs() {
		let res = await getChangelogs(project.id);
		if (res.success)
			changelogs = res.changelogs.sort((a, b) => {
				return b.timestamp - a.timestamp;
			});
	}

	let changelogInput = "";
	let publishUpdateModal = false;
	async function publishUpdateSubmit() {
		publishUpdateModal = false;
		let res = await publishProjectUpdate(project.id, changelogInput);
		if (res.success) {
			addToast("Update published!", "Your project has been updated.", "success", 3);
			loadChangelogs();
		} else {
			addToast("Failed!", "Failed to publish update. Error: " + (res.error ?? "no error"), "error");
		}
	}

	$: if (project?.id) {
		loadChangelogs();
	}
</script>

{#if project.visible}
	<button class="button green open-update-menu" on:click|preventDefault={() => { publishUpdateModal = true; }}>Configure new update</button>
{:else}
	<button class="button disabled open-update-menu" disabled>Configure new update</button>
{/if}

<h3>Changelog history</h3>
<div class="changelogs-container">
	{#each changelogs as log}
		<ChangeLog log={log} />
	{/each}

	{#if changelogs.length <= 0}
		<span class="empty-message">No changelogs exist yet.</span>
	{/if}
</div>

<Modal title="Publish update" bind:opened={publishUpdateModal}>
	<p>Are you sure you publish an update? This will update the date_edited value to the current time, allowing other software to know it has been updated recently.</p>
	<p>This will also send a notification to anyone who is following this project.</p>

	<form class="model-form" on:submit|preventDefault={publishUpdateSubmit}>
		<label for="changelogBody">Changelog</label>
		<textarea bind:value={changelogInput} id="changelogBody" placeholder="Briefly explain what has been added/updated regarding the project." maxlength="2450"></textarea>
		<button type="submit" style="width:100%;" class="button green">Publish update</button>
	</form>
</Modal>

<style>
	.changelogs-container {
		position: relative;
		background-color: #222;
		padding: 1rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 4rem;
		margin-top: 1rem;
	}

	.open-update-menu {
		float: right;
	}
</style>