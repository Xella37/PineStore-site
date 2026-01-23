
<svelte:head>
	<title>Docs - PineStore</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="PineStore Documentation" />
	<meta property="og:description" content="This is the full API documentation for interacting with the database of PineStore." />
	<meta name="description" content="This is the full API documentation for interacting with the database of PineStore." />
	<meta name="twitter:description" content="This is the full API documentation for interacting with the database of PineStore." />
	<meta property="og:url" content="https://pinestore.cc/documentation/{pageId}" />
	<meta property="og:image" content="/pinestore_cropped.png" />
	<meta name="keywords" content="docs, documentation, api, endpoint, get, post, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<script>
	import Highlight from "svelte-highlight";
	import json from "svelte-highlight/languages/json";

	import { page } from "$app/stores";
    import EndpointTesting from "./EndpointTesting.svelte";
    import Markdown from "$lib/svelte/Markdown.svelte";

	export let data;

	$: pageId = $page.params.id;

	let pages = data.pages;
	let thisPage = data.thisPage;

	let exampleReturn = thisPage.example_return;
	let playgroundEnabled = thisPage.playground_enabled;
	let selectedTab = "example";

	$: if (pageId) {
		for (const p of pages) {
			if (p.id == pageId) {
				thisPage = p;
				break;
			}
		}
		exampleReturn = thisPage.example_return;
		playgroundEnabled = thisPage.playground_enabled;

		if (exampleReturn == null)
			selectedTab = "playground";
		else if (!playgroundEnabled)
			selectedTab = "example";
	}
</script>

<div id="backgroundContainer" style="background-image: url('/bg_space.png')"></div>

<div class="page-container">
	<div class="page page-wide shadow">
		<h1>Documentation</h1>
		<div id="docs">
			<div id="sidebar">
				{#each pages as page}
					<a data-sveltekit-noscroll href="/documentation/{page.id}" class="no-link" class:current-page={page.id == pageId} class:title={page.title} class:first-of-group={page.first_of_group}>
						{#if page.title}
							<span class="path">{page.title}</span>
						{:else}
							<span class="type type-{page.type}">{page.type}</span>
							<span class="path">
								{#if page.path.startsWith("/api/auth")}
									<i class="path-start">/api/auth</i>{page.path.slice(9)}
								{:else if page.path.startsWith("/api")}
									<i class="path-start">/api</i>{page.path.slice(4)}
								{:else}
									{page.path}
								{/if}
							</span>
						{/if}
					</a>
				{/each}
			</div>

			<div id="content">
				{#if thisPage.title}
					<h2>{thisPage.title}</h2>
				{:else}
					<h2>{thisPage.type} {thisPage.path}</h2>
				{/if}

				{#if thisPage.body}
					<p>
						{@html thisPage.body}
					</p>
				{/if}

				{#if thisPage.body_markdown}
					<Markdown source="{thisPage.body_markdown}" />
				{/if}

				{#if thisPage.url_params}
					<h3>URL Params</h3>
					<div class="param-list">
						{#each thisPage.url_params as param}
							<div class="param">
								<h4>Param: <span class="param-name">{param.name}</span> {#if param.optional}<span class="param-optional">optional</span>{/if}</h4>
								<p>{param.description}</p>
							</div>
						{/each}
					</div>
				{/if}

				{#if thisPage.get_params}
					<h3>GET Params</h3>
					<div class="param-list">
						{#each thisPage.get_params as param}
							<div class="param">
								<h4>Param: <span class="param-name">{param.name}</span> {#if param.optional}<span class="param-optional">optional</span>{/if}</h4>
								<p>{param.description}</p>
							</div>
						{/each}
					</div>
				{/if}

				{#if thisPage.post_params}
					<h3>POST Params</h3>
					<div class="param-list">
						{#each thisPage.post_params as param}
							<div class="param">
								<h4>Param: <span class="param-name">{param.name}</span> {#if param.optional}<span class="param-optional">optional</span>{/if}</h4>
								<p>{param.description}</p>
							</div>
						{/each}
					</div>
				{/if}

				{#if exampleReturn || playgroundEnabled}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<div class="example-tabs">
						{#if exampleReturn}
							<h3 on:click={() => { selectedTab = "example"; }} class:selected-tab={selectedTab == "example"}>Example of response</h3>
						{/if}

						{#if playgroundEnabled}
							<h3 on:click={() => { selectedTab = "playground"; }} class:selected-tab={selectedTab == "playground"}>Interactive playground</h3>
						{/if}
					</div>

					<div class="example-tabs-content">
						{#if exampleReturn}
							<div class="tab-content" class:selected={selectedTab == "example"}>
								<div class="tab-content" class:selected={selectedTab == "example"}>
									<div class="code-block">
										<Highlight language={json} code={exampleReturn} />
									</div>
								</div>
							</div>
						{/if}
	
						{#if playgroundEnabled}
							<div class="tab-content" class:selected={selectedTab == "playground"}>
								<EndpointTesting path={thisPage.path} url_params={thisPage.url_params ?? []} get_params={thisPage.get_params ?? []} />
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	#docs {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}
	#sidebar {
		display: flex;
		flex-direction: column;
		gap: 0.37rem;
	}
	#sidebar a {
		background-color: #444;
		padding: 0.5rem 0.75rem;
		padding-right: 1rem;
		border-radius: 1rem;
		font-size: 1.25rem;
		white-space: nowrap;
	}
	#sidebar a:hover {
		background-color: #4C4C4C;
	}
	#sidebar a.title {
		/* background-color: #7F664C; */
		padding-left: 3rem;
		font-weight: 600;
	}
	#sidebar a.title:not(:first-of-type) {
		margin-top: 1.5rem;
	}
	#sidebar a.first-of-group {
		margin-top: 1rem;
	}
	/* #sidebar a.title:hover {
		background-color: #9c7e5e;
	} */
	#sidebar a.current-page {
		background-color: var(--cc-blue);
	}
	#sidebar a span.type {
		color: black;
		display: inline-block;
		min-width: 5rem;
		border-radius: 1rem;
		text-align: center;
		margin-right: 0.5rem;
	}
	#sidebar a span.type-GET {
		background-color: #7FCC19;
	}
	#sidebar a span.type-POST {
		background-color: #4C99B2;
	}
	#sidebar a span.path {
		color: white;
	}
	#sidebar a .path-start {
		color: var(--text-color-dark);
		font-style: normal;
		margin-right: 0.125rem;
	}

	#content {
		flex-grow: 1;
		min-width: 0;
		border-top: 0.5rem solid #444;
	}

	.param-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.param {
		border-left: 0.5rem solid #444;
		padding-left: 1rem;
	}
	.param > * {
		margin: 0.5rem;
	}
	.param h4 {
		color: var(--text-color-dark);
	}
	.param h4 span.param-name {
		/* color: var(--text-color); */
		color: #7FCC19;
	}
	.param h4 span.param-optional {
		color: var(--cc-lightBlue);
		font-weight: 300;
		margin-left: 1rem;
	}
	.param p {
		font-style: italic;
	}

	.code-unready {
		display: none;
	}
	.codeblock-placeholder {
		width: 100%;
		border-radius: 1rem;
		background-color: rgba(0, 0, 0, 0.25);
		padding-top: 10rem;
		padding-bottom: 10rem;
		font-size: 2rem;
		text-align: center;
	}

	@media screen and (max-width: 50rem) {
		#docs {
			flex-direction: column;
		}
		#sidebar a {
			white-space: break-spaces;
			overflow: visible;
			text-overflow: ellipsis;
		}
	}

	:global(pre.lua-codeblock) {
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 1rem;
		margin-top: 1rem;
		border-radius: 0.5rem;
		tab-size: 4ch;
		display: inline-block;
		width: 100%;
	}
	:global(pre.lua-codeblock) code {
		width: 100%;
		box-sizing: border-box;
	}

	.example-tabs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.example-tabs > * {
		background-color: var(--cc-gray);
		padding: 0.5rem 2rem;
		border-radius: 1rem;
		cursor: pointer;
		margin: 0;
	}
	.example-tabs > *.selected-tab {
		background-color: var(--cc-blue);
		font-weight: 600;
	}

	.tab-content {

	}
	.tab-content:not(.selected) {
		display: none;
	}

	@media screen and (min-width: 60rem) {
		.example-tabs {
			flex-direction: row;
			gap: 2rem;
			border-bottom: var(--cc-blue) 0.25rem solid;
			padding-left: 2rem;
		}

		.example-tabs > * {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
		.example-tabs > *.selected-tab {
		}

		.tab-content {

		}
		.tab-content:not(.selected) {
		}
	}
</style>