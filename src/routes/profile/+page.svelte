
<svelte:head>
	<title>Profile</title>
</svelte:head>

<script>
	import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
	import { BASE_URL, getMyProfile } from "$lib/database.js";
	
	import ConfigProfile from "./ConfigProfile.svelte";
	import ConfigOptions from "./ConfigOptions.svelte";
	import ConfigProjects from "./ConfigProjects.svelte";
	import ConfigAnalytics from "./ConfigAnalytics.svelte";

	const DEFAULT_TAB = "profile";

	let profile = {
		name: "loading...",
		profile_public: true,
		joined_on: 0,
		about: "loading...",
		about_markdown: "loading...",
	}

	$: selectedTab = $page.url.searchParams.get("tab") ?? DEFAULT_TAB;
	function selectTab(newTab) {
		const url = new URL($page.url);

		if (newTab === DEFAULT_TAB) {
			url.searchParams.delete("tab");
		} else {
			url.searchParams.set("tab", newTab);
		}

		goto(url, { keepFocus: true, noScroll: true });
	}

	async function loadProfile() {
		let profileData = await getMyProfile();
		if (!profileData.success)
			return addToast("Failed!", "Error: " + (profileData.error ?? "no error"), "error");
		profile = profileData.user;
	}

	onMount(() => {
		loadProfile();
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<!-- <div class="page page-full shadow"> -->
	<div class="columns">
		<div class="column sidebar island">
			<a href="/user/{profile.discord_id}" target="_blank" class="no-link">
				<div class="user">
					<img class="pfp" src="{BASE_URL}/pfp/{profile.discord_id}.png" alt="profile">
					
					<span>{profile.name}</span>

					<i class="fa-solid fa-arrow-up-right-from-square open-icon"></i>
				</div>
			</a>
			
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "profile"} on:click|preventDefault={() => { selectTab("profile"); }}>
				<i class="fa-solid fa-user"></i>
				My profile
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "options"} on:click|preventDefault={() => { selectTab("options"); }}>
				<i class="fa-solid fa-sliders"></i>
				Options
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "projects"} on:click|preventDefault={() => { selectTab("projects"); }}>
				<i class="fa-solid fa-list-ul"></i>
				Projects
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="tab" class:selected={selectedTab == "analytics"} on:click|preventDefault={() => { selectTab("analytics"); }}>
				<i class="fa-solid fa-chart-column"></i>
				Analytics
			</div>
		</div>

		<div class="column tab-content island">
			{#if selectedTab == "profile"}
				<ConfigProfile bind:profile />
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
		max-width: 1920px;
		margin: auto;
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

	.user {
		position: relative;
		padding-left: 7rem;
		padding-right: 3rem;
		padding-block: 2rem;
		margin-bottom: 1rem;
		border: solid 0.25rem var(--cc-gray);
		border-radius: 1rem;
		transition: all ease 100ms;
	}
	.user:hover {
		border: solid 0.25rem var(--cc-lightGray);
		background-color: var(--cc-gray);
	}
	.user img {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 4rem;
		height: 4rem;
		border-radius: 4rem;
	}
	.user span {
		font-size: 1.5rem;
		color: var(--text-color-medium);
	}
	.user .open-icon {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 1.5rem;
		color: var(--text-color-dark);
	}
</style>