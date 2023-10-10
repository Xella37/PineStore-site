<svelte:head>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/default.min.css">
	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";

	export let text;

	let displayCode = true;

	onMount(async () => {
		hljs.highlightAll();
	});

	$: if (text && browser) {
		displayCode = false;
		setTimeout(() => {
			displayCode = true;
			setTimeout(() => {
				hljs.highlightAll();
			}, 0);
		}, 100);
	}
</script>

{#if displayCode}
	<pre class="lua-codeblock"><code class="language-lua">{text}</code></pre>
{/if}

<style>
	pre.lua-codeblock {
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 1rem;
		margin-top: 1rem;
		border-radius: 0.5rem;
		tab-size: 4ch;
	}
	pre.lua-codeblock code {
		width: 100%;
		box-sizing: border-box;
	}
</style>
