
<script>
	import { fly, fade } from "svelte/transition";

	export let title = "Untitled";
	export let opened = false;
</script>

{#if opened}
	<div class="modal" transition:fly={{y: 20}}>
		<button class="modal-close" on:click={() => { opened = false; }}>
			<i class="fa-solid fa-xmark"></i>
		</button>

		<span class="modal-title">{title}</span>

		<slot />
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div transition:fade class="modal-darken" on:click={() => { opened = false; }}></div>
{/if}

<style>
	.modal {
		position: fixed;
		z-index: 100;
		display: block;
		width: calc(100% - 2rem);
		max-width: 30rem;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		background-color: #333;
		padding: 1rem;
		border-radius: 1rem;
	}
	.modal-close {
		background: none;
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 2rem;
		color: var(--text-color-dark);
		cursor: pointer;
	}
	.modal button[type="submit"] {
		margin-top: 1rem;
	}
	.modal-title {
		font-size: 2rem;
		text-align: center;
		display: inline-block;
		width: 100%;
		margin-bottom: 1rem;
	}
	.modal-darken {
		position: fixed;
		z-index: 50;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>