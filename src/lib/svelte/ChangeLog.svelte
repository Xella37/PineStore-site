
<script>
	import { formatShortDate } from "$lib/util.js";
	import Markdown from "$lib/svelte/Markdown.svelte";

	export let log;

	let expanded = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="changelog markdown-container" on:click|preventDefault={() => { expanded = !expanded; }}>
	<span>Updated {formatShortDate(log.timestamp)}</span>
	{#if expanded}
		<Markdown source={log.body ?? "Empty log"} />
	{:else}
		<p class="collapsed">{log.body ?? "Empty log"}</p>
	{/if}
	<i class="fa-solid fa-angle-left expand-indicator" class:expanded={expanded}></i>
</div>

<style>
	.changelog {
		position: relative;
		background-color: var(--cc-gray);
		border-radius: 1rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.changelog:hover {
		background-color: #666;
	}
	.changelog p.collapsed {
		margin-bottom: 0.5rem;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		-webkit-user-select: none;
	    user-select: none;
	}

	.expand-indicator {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		transition: all ease 100ms;
	}
	.expand-indicator.expanded {
		transform: rotate(-90deg);
	}
</style>