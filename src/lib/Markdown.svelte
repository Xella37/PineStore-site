<script>
	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "$lib/MDImage.svelte";
	import MDCode from "$lib/MDCode.svelte";
	import MDHtml from "$lib/MDHtml.svelte";

	export let source = "";

	let renderers = {
		image: MDImage,
		code: MDCode,
		html: MDHtml
	}
</script>

<SvelteMarkdown source={source} renderers={renderers} />
