
<svelte:head>
	<title>{user.name} - Profile</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="{user.name} - Profile" />
	<meta property="og:description" content="{user.about}" />
	<meta name="description" content="{user.about}" />
	<meta name="twitter:description" content="{user.about}" />
	<meta property="og:url" content="https://pinestore.cc/user/{user.discord_id}" />
	<meta property="og:image" content="https://pinestore.cc/pfp/{user.discord_id}.png" />
	<meta name="keywords" content="{user.name}, user, profile, profile page, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "./MDImage.svelte";
	import MDCode from "./MDCode.svelte";
    import ProjectList from "./../../ProjectList.svelte";

	export let data;
	let user = data.user;
	let projects = data.projects;

	const ABOUT_PLACEHOLDER = `*This user does not yet have about info.*`;

	let createdDate = new Date(user.joined_on);
	createdDate = createdDate.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<img class="pfp" src="https://pinestore.cc/pfp/{user.discord_id}.png" alt="profile">
		<span class="created-date"><div id="joinedOn">Joined on</div> {createdDate}</span>
		<h1>
			{user.name}
		</h1>

		<p id="about" class="markdown-container">
			{#if user.about_markdown}
				<SvelteMarkdown source={user.about_markdown} renderers={{ image: MDImage, code: MDCode }} />
			{:else if user.about}
				<SvelteMarkdown source={user.about} renderers={{ image: MDImage, code: MDCode }} />
			{:else}
				<SvelteMarkdown source={ABOUT_PLACEHOLDER} renderers={{ image: MDImage, code: MDCode }} />
			{/if}
		</p>

		<div class="ruler-text">
			<span>user has {projects.length} {projects.length == 1 && "project" || "projects"}</span>
		</div>

		<ProjectList projects={projects} blocks=true />
	</div>
</div>

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
</style>