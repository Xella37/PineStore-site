<script>
	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "$lib/MDImage.svelte";
	import MDCode from "$lib/MDCode.svelte";
	import MDHtmlEscaped from "$lib/MDHtmlEscaped.svelte";
	import MDHtmlSanitized from "$lib/MDHtmlSanitized.svelte";

	export let source = "";
	export let escaped = false;

	let renderers = {
		image: MDImage,
		code: MDCode,
		html: escaped ? MDHtmlEscaped : MDHtmlSanitized,
	}
</script>

<SvelteMarkdown source={source} renderers={renderers} />
