
<script>
	import { BASE_URL } from "$lib/database.js";

	export let profile;
</script>

<a href="/user/{profile.discord_id}" target="_blank" class="no-link">
	<div class="user">
		<img class="pfp" src="{BASE_URL}/pfp/{profile.discord_id}.png" alt="profile">
		
		<span>{profile.name}</span>

		<i class="fa-solid fa-arrow-up-right-from-square open-icon"></i>
	</div>
</a>

<style>
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