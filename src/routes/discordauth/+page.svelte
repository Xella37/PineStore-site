
<svelte:head>
	<title>Discord Auth</title>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { authDiscord } from "$lib/database.js";

	const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

	let success;
	let error;

	onMount(async () => {
		let data = await authDiscord(authCode);
		success = data.success;
		error = data.error;

		if (success) {
			let token = data.sessionToken;
			document.cookie = `session=${token}; path=/; max-age=${60*60*24*30}`;
			window.location.href = "/profile";
		}
	});
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>Discord Auth</h1>
		{#if success == null}
			<p>Authenticating with Discord... Please wait a moment.</p>
		{:else if success}
			<p>Successfully logged in! You will be redirected shortly.</p>
		{:else}
			<p>Failed to login: {error}</p>
		{/if}
	</div>
</div>
