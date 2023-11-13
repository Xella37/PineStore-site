
<script>
	import { toasts } from "$lib/util.js";
	import { slide } from "svelte/transition";

	function closeToast(i) {
		$toasts.splice(i, 1);
		$toasts = $toasts;
	}

	setInterval(() => {
		let now = Date.now();

		for (let i = $toasts.length; i--; i >= 0) {
			let toast = $toasts[i];
			if (toast.duration && now > toast.timestamp + toast.duration)
				closeToast(i);
		}
	}, 250);
</script>

<div class="toasts-container">
	{#each $toasts as toast, i (toast.id)}
		<div class="toast shadow" transition:slide>
			<button on:click|preventDefault={() => { closeToast(i); }}><i class="fa-solid fa-xmark"></i></button>

			<span class="title">
				{#if toast.icon == "success"}
					<i class="success fa-solid fa-circle-check"></i>
				{:else if toast.icon == "info"}
					<i class="info fa-solid fa-circle-exclamation"></i>
				{:else if toast.icon == "error"}
					<i class="error fa-solid fa-circle-xmark"></i>
				{:else if toast.icon == "warning"}
					<i class="warning text-shadow fa-solid fa-triangle-exclamation"></i>
				{/if}

				{toast.title}
			</span>
			<span class="body">{toast.body}</span>
		</div>
	{/each}
</div>

<style>
	.toasts-container {
		position: fixed;
		z-index: 200;
		bottom: 0;
		right: 0;
		width: 25rem;
		max-width: 100vw;
		padding: 1rem;
	}

	.toast {
		position: relative;
		display: block;
		margin-top: 1rem;
		background-color: #DDD;
		color: black;
		border-radius: 1rem;
		padding: 0.75rem 1rem;
	}
	.toast .title {
		display: block;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.toast button {
		position: absolute;
		top: 0;
		right: 0;
		background: none;
		border: none;
		padding: 1rem;
		font-size: 1rem;
	}
	.toast .title i {
		margin-right: 0.5rem;
	}
	.toast .title i.success {
		color: var(--cc-green);
	}
	.toast .title i.info {
		color: var(--cc-blue);
	}
	.toast .title i.error {
		color: var(--cc-red);
	}
	.toast .title i.warning {
		color: var(--cc-orange);
	}
</style>