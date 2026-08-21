
<script>
	import { getUserOptions, setUserOptions } from "$lib/database.js";
    import { onMount } from "svelte";
	import { addToast } from "$lib/util.js";

	async function loadOptions() {
		let optionsData = await getUserOptions();
		options = optionsData.options ?? {};
	}

	let options = {};
	async function sendUserOptions(e) {
		await setUserOptions(options);
		addToast("Updated!", "Updated user options!", "success", 3);
	}

	let toggleOptions = [
		{id: "discord_noti_comment", title: "New comments on your projects", icon: "fa-regular fa-comment-dots"},
		{id: "discord_noti_reply", title: "New replies to your comments", icon: "fa-regular fa-comment-dots"},
		{id: "discord_noti_newfollow_user", title: "New followers", icon: "fa-solid fa-user-plus"},
		{id: "discord_noti_newfollow_project", title: "New project saves/followers", icon: "fa-solid fa-user-plus"},
		{id: "discord_noti_milestone_views", title: "Milestones for your project views", icon: "fa-solid fa-award"},
		{id: "discord_noti_milestone_downloads", title: "Milestones for your project downloads", icon: "fa-solid fa-award"},
		{id: "discord_noti_following_newproject", title: "Newly published project from following", icon: "fa-solid fa-file-arrow-up"},
		{id: "discord_noti_following_projectupdate", title: "Updates for saved projects", icon: "fa-solid fa-rotate"},
	];
	async function toggleOption(option) {
		options[option] = !options[option];
		await sendUserOptions();
	}

	onMount(() => {
		loadOptions();
	});
</script>

<h2>Discord notifications (bot DMs)</h2>

<p>All notifications will be visible in the top-right, but you can additionally enable to be notified on Discord with a DM from our bot.</p>
<p>You must have a Discord server in common with our bot. You can <a href="https://discord.com/oauth2/authorize?client_id=1073728324142116948&scope=bot&permissions=277025475584">add the bot</a> to your server, or alternatively join <a href="https://discord.gg/XNBftfypnX">our Discord server</a>.</p>

<form>
	<div class="ruler-text">
		<span>notification list</span>
	</div>

	<div class="options-list">
		{#each toggleOptions as option}
			<div class="option">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<button id="toggleButton-{option.id}" style="font-size: 1.75rem;" class="toggle" class:enabled={options != null && options[option.id]} on:click|preventDefault={() => { toggleOption(option.id); }}></button>
				<label for="toggleButton-{option.id}">
					{#if option.icon}
						<i class="{option.icon}"></i>
					{/if}
					{option.title}
				</label>
			</div>
		{/each}
	</div>
</form>

<style>
	.options-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
	}
	.option {
		display: inline-flex;
		justify-content: left;
	}
	.option label {
		display: inline-block;
		margin: auto;
		margin-left: 1rem;
		cursor: pointer;
	}
	.option label i {
		margin-right: 0.75em;
		color: var(--text-color-medium);
	}
</style>