
<svelte:head>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/default.min.css">
	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>

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
	import { onMount } from "svelte";

	import { page } from "$app/stores";
	$: pageId = $page.params.id;

	export let data;
	let pages = data.pages;
	$: thisPage = data.thisPage;

	$: exampleReturn = thisPage.example_return;
	let includeCodeBlocks = true;

	let mounted = false;
	let codeblockRendered = false;

	function firstCodeHighlight() {
		if (typeof(hljs) == "undefined")
			return setTimeout(firstCodeHighlight, 250);
		hljs.highlightAll();
		codeblockRendered = true;
		mounted = true;
	}

	onMount(firstCodeHighlight);
	$: if (pageId) {
		// console.log("Switched to page " + pageId);
		if (mounted) {
			codeblockRendered = false;
			includeCodeBlocks = false;
			setTimeout(() => {
				includeCodeBlocks = true;
				setTimeout(() => {
					// console.log("Re-highlighting!");
					hljs.highlightAll();
					codeblockRendered = true;
				}, 0);
			}, 100);
		}
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

				{#if exampleReturn}
					<h3>Example of returned JSON</h3>

					{#if includeCodeBlocks}
						<pre class="lua-codeblock" class:code-unready={!codeblockRendered}><code class="language-lua">{exampleReturn}</code></pre>
					{/if}
					{#if !codeblockRendered}
						<div class="codeblock-placeholder">
							<i class="fa-solid fa-code"></i>
						</div>
					{/if}
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
			padding-right: 1rem;
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
</style>