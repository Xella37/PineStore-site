
<svelte:head>
	<title>Profile</title>
	<!-- <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script> -->
</svelte:head>

<script>
    import ConfigProfile from "./ConfigProfile.svelte";
    import ConfigOptions from "./ConfigOptions.svelte";
    import ConfigProjects from "./ConfigProjects.svelte";
    import ConfigAnalytics from "./ConfigAnalytics.svelte";

	let selectedTab = "profile";
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-full shadow">
		<div class="sidebar">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "profile"} on:click|preventDefault={() => { selectedTab = "profile"; }}>
				<i class="fa-solid fa-user"></i>
				My profile
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "options"} on:click|preventDefault={() => { selectedTab = "options"; }}>
				<i class="fa-solid fa-sliders"></i>
				Options
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "projects"} on:click|preventDefault={() => { selectedTab = "projects"; }}>
				<i class="fa-solid fa-list-ul"></i>
				Projects
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "analytics"} on:click|preventDefault={() => { selectedTab = "analytics"; }}>
				<i class="fa-solid fa-chart-column"></i>
				Analytics
			</div>
		</div>

		{#if selectedTab == "profile"}
			<div class="tab-content"><ConfigProfile /></div>
		{:else if selectedTab == "options"}
			<div class="tab-content"><ConfigOptions /></div>
		{:else if selectedTab == "projects"}
			<div class="tab-content"><ConfigProjects /></div>
		{:else if selectedTab == "analytics"}
			<div class="tab-content"><ConfigAnalytics /></div>
		{/if}
	</div>
</div>

<style>
	.page {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		min-height: 100vh;
	}

	.sidebar {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 14rem;
	}
	.tab {
		padding: 1rem 2rem;
		border-radius: 1rem;
		background-color: #444;
		font-size: 1.25rem;
		cursor: pointer;
		user-select: none;
	}
	.tab i {
		margin-right: 0.5em;
		color: var(--text-color-medium);
	}
	.tab:hover {
		background-color: #4C4C4C;
	}
	.tab.selected {
		background-color: var(--cc-blue);
	}

	.tab-content {
		/* flex-grow: 4; */
		flex: 4;
		min-width: 0;
	}

	@media (max-width: 800px) {
		.page {
			flex-direction: column;
			gap: 1rem;
		}
		.sidebar {
			flex-direction: row;
			/* max-width: 100%; */
			overflow-x: auto;
			margin-inline: -2rem;
			box-sizing: border-box;
			padding: 2rem;
			flex: 0;
			min-width: unset;
			background-color: #222;
			margin-top: -2rem;
			
		}
		.tab {
			position: relative;
			text-align: center;
			white-space: nowrap;
			padding: 0.5rem 1rem;
			flex: 1;
		}
	}
</style>