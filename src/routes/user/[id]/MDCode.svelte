<svelte:head>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/default.min.css">
	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
</svelte:head>

<script>
	import { onMount } from "svelte";

	export let text;

	onMount(async () => {
		hljs.highlightAll();
	});
</script>

<pre class="lua-codeblock"><code class="language-lua">{text}</code></pre>

<style>
	pre {
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 1rem;
	}
</style>
