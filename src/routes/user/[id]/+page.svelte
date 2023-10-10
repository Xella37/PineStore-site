
<svelte:head>
	<title>{user.name} - Profile</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{user.name} - Profile" />
	<meta property="og:description" content="{user.about}" />
	<meta name="description" content="{user.about}" />
	<meta name="twitter:description" content="{user.about}" />
	<meta property="og:url" content="{BASE_URL}/user/{user.discord_id}" />
	<meta property="og:image" content="{BASE_URL}/pfp/{user.discord_id}.png" />
	<meta name="keywords" content="{user.name}, user, profile, profile page, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import { onMount } from "svelte";
	import Markdown from "$lib/Markdown.svelte";
	import Modal from "$lib/Modal.svelte";
    import ProjectList from "./../../ProjectList.svelte";
	import { addToast } from "$lib/util.js";
	import { BASE_URL, getMyProfile, followUser, unfollowUser, checkFollowingUser } from "$lib/database.js";

	export let data;
	let user = data.user;
	let projects = data.projects;

	let loginModalOpen = false;

	let myId = null;

	const ABOUT_PLACEHOLDER = `*This user does not yet have about info.*`;

	let createdDate = new Date(user.joined_on);
	createdDate = createdDate.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	let following = false;
	async function followButton() {
		following = !following;
		if (following) {
			let res = await followUser(user.discord_id);
			if (res.success)
				addToast("Following!", "You are now following this user.", "success", 3);
			else
				addToast("Failed!", "Failed to follow user. Error: " + (res.error ?? "no error"), "error");
		} else {
			let res = await unfollowUser(user.discord_id);
			if (res.success)
				addToast("Unfollowed!", "You are no longer following this user.", "success", 3);
			else
				addToast("Failed!", "Failed to unfollow user. Error: " + (res.error ?? "no error"), "error");
		}
	}

	onMount(async () => {
		let profileData = await getMyProfile();
		myId = profileData?.user?.discord_id;
		if (myId != null) {
			let followingData = await checkFollowingUser(user.discord_id);
			following = followingData.following;
		}
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<div class="top-buttons">
			{#if myId == null}
				<button class="button" on:click|preventDefault={() => { loginModalOpen = true; }}>
					<i class="fa-solid fa-user-plus"></i>
					Follow
				</button>
			{:else if user.discord_id != myId}
				{#if following}
					<button class="button gray" on:click|preventDefault={followButton}>
						<i class="fa-solid fa-user-check"></i>
						Following
					</button>
				{:else}
					<button class="button" on:click|preventDefault={followButton}>
						<i class="fa-solid fa-user-plus"></i>
						Follow
					</button>
				{/if}
			{/if}
		</div>

		<img class="pfp" src="{BASE_URL}/pfp/{user.discord_id}.png" alt="profile">
		<span class="created-date"><div id="joinedOn">Joined on</div> {createdDate}</span>
		<h1>
			{user.name}
		</h1>

		<p id="about" class="markdown-container">
			{#if user.about_markdown}
				<Markdown source={user.about_markdown} />
			{:else if user.about}
				<Markdown source={user.about} />
			{:else}
				<Markdown source={ABOUT_PLACEHOLDER} />
			{/if}
		</p>

		<div class="ruler-text">
			<span>user has {projects.length} {projects.length == 1 && "project" || "projects"}</span>
		</div>

		<ProjectList projects={projects} blocks=true />
	</div>
</div>

<Modal title="Login" bind:opened={loginModalOpen}>
	<p>To follow users, you need to be logged in on the site.</p>
	<a href="https://discord.com/api/oauth2/authorize?client_id=1073728324142116948&redirect_uri=https%3A%2F%2Fpinestore.cc%2Fdiscordauth&response_type=code&scope=identify" class="modal-button button">
		<i class="fa-brands fa-discord"></i>
		Login with Discord
	</a>
</Modal>

<style>
	h1 {
		font-size: 4rem;
	}

	.created-date {
		position: absolute;
		color: var(--text-color-dark);
	}
	.created-date #joinedOn {
		display: inline-block;
	}

	.pfp {
		border-radius: 100vw;
		float: right;
		width: 8rem;
	}

	@media screen and (max-width: 45rem) {
		h1 {
			font-size: 2.5rem;
			margin-top: 3rem;
		}

		.pfp {
			width: 5rem;
		}
	}

	@media screen and (max-width: 25rem) {
		.created-date #joinedOn {
			display: none;
		}
	}

	#about {
		overflow: hidden;
		margin-top: 2rem;
		margin-bottom: 2rem;
	}

	.ruler-text {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.top-buttons {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
		position: absolute;
		z-index: 10;
		left: 50%;
		transform: translateX(-50%);
	}
	.top-buttons > * {
		font-size: 1rem;
		border-radius: 10rem;
		text-align: center;
		min-width: 9rem;
	}
	.top-buttons > * i {
		margin-right: 0.5rem;
	}
	@media screen and (max-width: 40rem) {
		.top-buttons {
			position: relative;
			width: 100%;
			margin-bottom: 1rem;
			box-sizing: border-box;
		}
		.top-buttons > * {
			flex: 1;
			min-width: 10rem;
		}
	}

	.modal-button {
		display: block;
		box-sizing: border-box;
		width: 100%;
		text-align: center;
	}
	.modal-button > i {
		margin-right: 0.5em;
	}
</style>