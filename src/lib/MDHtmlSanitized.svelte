<script>
	export let text;

	import DOMPurify from "isomorphic-dompurify";
</script>

{@html DOMPurify.sanitize(text)}