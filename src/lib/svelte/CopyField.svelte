
<script>
	import { fade } from "svelte/transition";
	import { addToast } from "$lib/util.js";

	export let text;

	let copied = false;
	function copyText() {
		let temp = document.createElement("input");
		temp.setAttribute("type", "text");
		temp.value = text;
		document.body.appendChild(temp);

		temp.select();
		document.execCommand("copy");
		document.body.removeChild(temp);

		copied = true;
		addToast("Copied!", "Copied link.", "info", 3);
	}
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<pre type="text" class:copied={copied} on:click={copyText}>{#if copied}<i id="copiedText" in:fade="{{ duration: 100 }}">Copied!</i>{/if}{text}<i id="copyButton" class="fas fa-copy"></i></pre>

<style>
	pre {
		background-color: rgba(0, 0, 0, 0.5);
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		font-size: 1.5rem;
		margin-block: 1rem;
	}

	pre {
		position: relative;
		user-select: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-right: 3rem;
	}
	pre:hover {
		cursor: pointer;
		color: grey;
	}

	#copyButton {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: grey;
		pointer-events: none;
	}
	#copiedText {
		color: #57A64E;
		position: absolute;
		left: 1rem;
	}

	/* @media screen and (max-width: 48rem) { */
		#copiedText {
			display: none;
		}
		pre.copied {
			background-color: #3d620d;
		}
		pre.copied #copyButton {
			color: var(--cc-lightGray);
		}
	/* } */
</style>