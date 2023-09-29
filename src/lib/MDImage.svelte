<script>
	export let text;
	export let href;
</script>

<img alt={text || "markdown in project description"} src={href} class="shadow">

<style>
	img {
		border-radius: 1rem;
		max-width: 100%;
		display: block;
		margin: auto;
	}
</style>
