
<script>
	import { onMount, onDestroy } from "svelte";

	export let jam;
	export let started = false;
	export let ended = false;
	
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	function updateTimerText() {
		let start = jam.date_start;
		let end = jam.date_end;
		let now = Date.now();
		started = now > start;
		ended = now > end;

		let dt = start - now;
		if (started)
			dt = end - now;
		if (ended)
			dt = 0;

		let s = Math.floor(dt / 1000);
		seconds = s % 60;
		let m = Math.floor(s / 60);
		minutes = m % 60;
		let h = Math.floor(m / 60);
		hours = h % 24;
		days = Math.floor(h / 24);
	}
	updateTimerText();

	let interval;

	function resetInterval() {
		clearInterval(interval);
		interval = setInterval(updateTimerText, 1000);
	}
	onMount(() => {
		resetInterval();
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="info-block time">
	<i class="fa-regular fa-hourglass-half"></i>

	<div class="timer">
		<div class="info">
			{#if !started}
				Starts in
			{:else if !ended}
				Ends in
			{:else if !jam.judging_finished}
				Judging in progress...
			{:else}
				JAM ENDED
			{/if}
		</div>
		<div class="block">
			<span class="count">{days}</span>
			<span class="label">{days == 1 ? "day" : "days"}</span>
		</div>
		<div class="block">
			<span class="count">{hours}</span>
			<span class="label">{hours == 1 ? "hour" : "hours"}</span>
		</div>
		<div class="block">
			<span class="count">{minutes}</span>
			<span class="label">{minutes == 1 ? "minute" : "minutes"}</span>
		</div>
		<div class="block">
			<span class="count">{seconds}</span>
			<span class="label">{seconds == 1 ? "second" : "seconds"}</span>
		</div>
	</div>
</div>

<style>
	.info-block.time {
		background-color: var(--cc-green);
		margin-top: 0;
	}

	.timer {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.timer > div.block {
		display: flex;
		flex-direction: column;
		border: 0.125rem white solid;
		border-radius: 1rem;
		min-width: 4.5rem;
		padding: 0.5rem 0.25rem;
	}
	.timer .label {
		font-size: 0.75rem;
	}
	.timer div.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (width < 860px) {
		.info-block.time {
			padding-left: 5rem;
		}

		.timer {
			gap: 1rem;
		}

		.timer div.info {
			width: 100%;
		}

		.timer > div.block {
			min-width: 34%;
			width: 3rem;
			padding: 0.3rem 0.15rem;
		}
	}
	
	

	@media (width < 320px) {
		.info-block.time {
			padding-left: 0;
			padding-right: 0;
		}
		.info-block.time i {
			transform: none;
			top: 1.25rem;
			font-size: 1.25rem;
		}

		.timer {
		}

		.timer div.info {
		}

		.timer > div.block {
		}
	}
</style>