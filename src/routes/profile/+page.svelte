
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
	<!-- <div class="page page-full shadow"> -->
	<div class="columns">
		<div class="column sidebar island">
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

		<div class="column tab-content island">
			{#if selectedTab == "profile"}
				<ConfigProfile />
			{:else if selectedTab == "options"}
				<ConfigOptions />
			{:else if selectedTab == "projects"}
				<ConfigProjects />
			{:else if selectedTab == "analytics"}
				<ConfigAnalytics />
			{/if}
		</div>
	</div>
</div>

<style>
	.page-container {
		--island-spacing: 4rem;
		--island-padding: 2rem;
	}

	.columns {
		position: relative;
		display: flex;
		flex-direction: row;
		gap: var(--island-spacing);
		padding: var(--island-spacing);
		align-items: flex-start;
	}
	.column {
		flex: 1;
	}

	@media (max-width: 1270px) {
		.columns {
			flex-direction: column;
		}
		.column {
			width: 100%;
			box-sizing: border-box;
		}
	}

	@media (max-width: 800px) {
		.page-container {
			--island-spacing: 2rem;
		}
	}
	@media (max-width: 450px) {
		.page-container {
			--island-spacing: 1rem;
			--island-padding: 1rem;
		}
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
		flex: 4;
		min-width: 0;
	}

	@media (max-width: 800px) {
		.sidebar {
			flex-direction: row;
			overflow-x: auto;
			margin-inline: calc(0rem - var(--island-spacing));
			width: calc(100% + 2*var(--island-spacing));
			box-sizing: border-box;
			padding: 2rem;
			flex: 0;
			min-width: unset;
			background-color: #222;
			margin-top: -1rem;
			border-radius: 0;
			
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