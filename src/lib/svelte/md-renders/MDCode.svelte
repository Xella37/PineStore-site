
<script>
	import Highlight from "svelte-highlight";
	import lua from "svelte-highlight/languages/lua";

	export let text;
</script>

<div class="code-block">
	<Highlight language={lua} code={text} />
</div>

<style>
	.code-block {
		margin-block: 1rem;
	}
</style>
