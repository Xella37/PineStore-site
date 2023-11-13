<script>
	import SvelteMarkdown from "svelte-markdown";
	import MDImage from "./md-renders/MDImage.svelte";
	import MDCode from "./md-renders/MDCode.svelte";
	import MDHtmlEscaped from "./md-renders/MDHtmlEscaped.svelte";
	import MDHtmlSanitized from "./md-renders/MDHtmlSanitized.svelte";

	export let source = "";
	export let escaped = false;

	let renderers = {
		image: MDImage,
		code: MDCode,
		html: escaped ? MDHtmlEscaped : MDHtmlSanitized,
	}
</script>

<SvelteMarkdown source={source} renderers={renderers} />
