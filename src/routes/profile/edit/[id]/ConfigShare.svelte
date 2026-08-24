
<script>
    import { onMount } from "svelte";

	export let project;

	let warnings = [];
	let warningsMinor = [];

	function checkWarnings() {
		let newWarnings = [];
		let newWarningsMinor = [];

		let hasInstall = project.install_command;
		let hasTarget = project.target_file;
		let hasRun = project.run_command;
		let hasDownload = project.download_url;
		let visibleInClients = project.visible_clients;

		if (!hasInstall && !hasRun && !hasDownload)
			newWarnings.push("Please add an install command, run command or download URL.");
		if (hasTarget && !hasInstall)
			newWarnings.push("An install_command is necessary for a target_file.");
		if (!hasTarget && hasInstall && visibleInClients)
			newWarnings.push("A target_file is necessary for an install_command for projects visible in clients.");
		if (visibleInClients && !(hasRun && hasTarget) && !hasInstall)
			newWarnings.push("To be visible for PineStore clients, you must have install_command + target_file, or install_command.");
		if (!visibleInClients && hasTarget)
			newWarnings.push("If you have a target_file configured, you should enable display in clients.");

		if (hasDownload && !hasInstall && !hasRun)
			newWarningsMinor.push("Make sure to only use a download URL when installing or running with a command is not applicable.");
		if (hasRun && !hasInstall)
			newWarningsMinor.push("Make sure to only use a run_command when an installer is not possible/feasible.");

		warnings = newWarnings;
		warningsMinor = newWarningsMinor;
	}

	$: if (project.visible_clients != null || project.install_command?.length >= 0 || project.target_file?.length >= 0 || project.run_command?.length >= 0 || project.download_url?.length >= 0) {
		checkWarnings();
	}
	onMount(checkWarnings);
</script>

<div class="cols installer-info">
	<div class="col form-list">
		<h3>
			<i class="fa-solid fa-download"></i>
			Install
		</h3>

		<label for="installInput">Command for any program to install e.g. games, utility, operating systems</label>
		<input id="installInput" type="text" bind:value={project.install_command} maxlength="150" placeholder="pastebin run ABC123">
		
		<label for="targetInput">Target file, to run after installation, used by PineStore clients</label>
		<input id="targetInput" type="text" bind:value={project.target_file} maxlength="30" placeholder="program.lua">
	</div>
	
	<div class="col form-list">
		<h3>
			<i class="fa-solid fa-bolt"></i>
			Direct run
		</h3>

		<label for="runInput">Run command (use only when you cannot make an installer to permanently install project)</label>
		<input id="runInput" type="text" bind:value={project.run_command} maxlength="150" placeholder="pastebin run ABC123">
	</div>
	
	<div class="col form-list">
		<h3>
			<i class="fa-solid fa-link"></i>
			Download
		</h3>

		<label for="downloadInput">Download url (when installer isn't possible, for e.g. mods, addons or resource packs, etc.)</label>
		<input id="downloadInput" type="text" bind:value={project.download_url} maxlength="150" placeholder="https://linktosite.cc/download.zip">
	</div>
</div>

<div class="form-list">	
	<label for="visibleInput">Display in PineStore clients</label>
	<button id="visibleInput" class="toggle" style="font-size: 1.75rem;" class:enabled={project.visible_clients} on:click|preventDefault={() => { project.visible_clients = !project.visible_clients; }} />
		
	<label for="repoInput">Git repository</label>
	<input id="repoInput" type="text" bind:value={project.repository} maxlength="150" placeholder="https://github.com/username/repository">
</div>

{#each warnings as warning}
	<div class="info-block warning">
		<i class="fa-solid fa-triangle-exclamation"></i>
		{warning}
	</div>
{/each}
{#each warningsMinor as warning}
	<div class="info-block info">
		<i class="fa-solid fa-circle-info"></i>
		{warning}
	</div>
{/each}

<style>
	.installer-info {
		margin-bottom: 3rem;
	}
	.installer-info label {
		margin-top: 0;
	}

	h3 i {
		color: var(--text-color-medium);
	}
</style>