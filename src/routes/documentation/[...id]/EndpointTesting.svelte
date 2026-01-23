<script>
	import { BASE_URL } from "$lib/database.js";

	import Highlight from "svelte-highlight";
	import json from "svelte-highlight/languages/json";
	
	export let path;
	export let url_params = [];
	export let get_params = [];

	let responseData = null;
	let final_url = "";

	$: if (path) {
		responseData = null;
		final_url = "";
	}

	async function submit() {
		let url = path;

		url_params.forEach(param => {
			const value = document.getElementById(param.name).value;
			url = url.replace(`:${param.name}`, encodeURIComponent(value));
		});

		let paramData = get_params.map(param => ({name: param.name, value: document.getElementById(param.name).value})).filter(p => p.value.length > 0);
		if (paramData.length > 0) {
			url += "?";
			url += paramData.map(param => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`).join("&");
		}

		final_url = BASE_URL + url;
		let response = await fetch(final_url);
		if (response.headers.get("content-type").startsWith("application/json"))
			responseData = await response.json();
		else
			responseData = await response.text();
	}
</script>

<form on:submit|preventDefault={submit}>
	<div class="param-list">
		{#each url_params as param}
			<div class="param">
				<label for="{param.name}">
					<div class="param-group">
						<span class="param-badge url">URL Param</span>
						<span class="param-name">{param.name}</span>
					</div>
				</label>
				<input required={!param.optional} id="{param.name}" type="text" name={param.name} value={param.example_value || ""} placeholder="{param.name}" />
			</div>
		{/each}

		{#each get_params as param}
			<div class="param">
				<label for="{param.name}">
					<div class="param-group">
						<span class="param-badge get">GET Param</span>
						<span class="param-name">{param.name}</span>
					</div>
				</label>
				<input required={!param.optional} id="{param.name}" type="text" name={param.name} value={param.example_value || ""} placeholder="{param.name}" />
			</div>
		{/each}

		{#if url_params.length + get_params.length <= 0}
			<p>
				No parameters available for this endpoint.
			</p>
		{/if}
	</div>
	<button class="button" type="submit">Run query</button>
</form>

{#if responseData}
	<h3>Response</h3>
	<p>Final URL: <span class="final-url">{final_url}</span></p>
	<div class="code-block">
		<Highlight language={json} code={JSON.stringify(responseData, null, 2)} />
	</div>
{/if}


<style>
	.param-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-block: 2rem;
	}

	.param {
		display: flex;
		gap: 0.5rem;
	}
	.param > * {
		flex: 1;
	}
	.param input {
		min-width: 3rem;
	}

	.param-group {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}

	.param-badge {
		display: inline-block;
		border: 0.125rem solid var(--cc-orange);
		border-radius: 1rem;
		padding: 0.5rem 1rem;
		margin-right: 1rem;
	}
	.param-badge.url {
		border: 0.125rem solid var(--cc-lightBlue);
	}
	.param-badge.get {
		border: 0.125rem solid var(--cc-lime);
	}
	.param-name {
		display: inline-block;
		padding: 0.25rem 0.5rem;
	}

	form .button {
		width: 100%;
		margin-block: 2rem;
	}

	.final-url {
		display: inline-block;
		background-color: rgba(0, 0, 0, 0.25);
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		margin-block: 0.5rem;
		margin-inline: 1rem;
	}

	@media screen and (max-width: 1000px) {
		.param-badge {
			margin-right: 0.5rem;
		}
		.param input {
			flex: 0.25;
		}
	}
</style>