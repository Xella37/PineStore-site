
<script>
	import { BASE_URL } from "$lib/database.js";

	export let jam;

	function formatShortDate(d) {
		let projectDate = new Date(d);
		return projectDate.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}

	const STATUS_MAP = {
		"starting": "Starting soon",
		"ongoing": "Active now",
		"judging": "Judging in progress",
		"results": "Results out",
	};
</script>

<div class="jam" class:status-starting={jam.status === "starting"} class:status-ongoing={jam.status === "ongoing"} class:status-judging={jam.status === "judging"} class:status-results={jam.status === "results"}>
	<img src="{BASE_URL}/{jam.id}.png" alt="Banner for {jam.title}" class="jam-logo" />

	<span class="status">{STATUS_MAP[jam.status]}</span>
	<h2>{jam.title}</h2>
	<div class="period">From <span class="date">{formatShortDate(jam.date_start)}</span> to <span class="date">{formatShortDate(jam.date_end)}</span> (your time)</div>
	<div class="counters">
		<div class="counter">
			<span class="count">{jam.contestant_count}</span>
			<span class="label">joined</span>
		</div>
		<div class="counter">
			<span class="count">{jam.submission_count}</span>
			<span class="label">submissions</span>
		</div>
	</div>
	<a href="/jam/{jam.id}" class="button">View jam</a>
</div>

<style>
	.jam {
		position: relative;
		--status-color: #FFF;
		--status-color-text: #000;
		border-radius: 1rem;
		padding: 1rem;
		padding-right: 38rem;
		background-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--status-color) 100%);
	}

	.jam.status-starting {
		--status-color: var(--cc-green);
		--status-color-text: #FFF;
	}
	.jam.status-ongoing {
		--status-color: var(--cc-green);
		--status-color-text: #FFF;
	}
	.jam.status-judging {
		--status-color: var(--cc-cyan);
		--status-color-text: #FFF;
	}
	.jam.status-results {
		--status-color: var(--cc-lightBlue);
		--status-color-text: #000;
	}

	.jam::before {
		position: absolute;
		content: "";
		background-color: var(--status-color);
		border-radius: 1rem;
		top: 0;
		bottom: 0;
		left: -2rem;
		width: 1rem;
	}

	.jam h2 {
		font-size: 2.5rem;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.period {
		color: var(--text-color-dark);
		margin-bottom: 1rem;
	}
	.period .date {
		color: var(--text-color);
		margin-inline: 0.5rem;
	}

	.counters {
		display: flex;
		gap: 1rem 4rem;
		margin-block: 1rem;
		padding-inline: 2rem;
		flex-wrap: wrap;
	}
	.counter {
		position: relative;
		min-width: 6rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem 0.25rem;
		--bg-color: var(--cc-gray);
		background-color: var(--bg-color);
		text-align: center;
	}
	.counter::before {
		content: "";
		position: absolute;
		background-color: var(--bg-color);
		top: 0;
		bottom: 0;
		left: -1.5rem;
		width: 1.5rem;
		clip-path: polygon(100% 100%, 100% 0%, 0% 100%);
	}
	.counter::after {
		content: "";
		position: absolute;
		background-color: var(--bg-color);
		top: 0;
		bottom: 0;
		right: -1.5rem;
		width: 1.5rem;
		clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
	}
	.counter .count {
		font-size: 2rem;
		color: var(--text-color);
		font-weight: bold;
	}
	.counter .label {
		color: var(--text-color-medium);
	}

	span.status {
		float: right;
		/* display: inline-block; */
		color: var(--status-color-text);
		background-color: var(--status-color);
		font-size: 1.25rem;
		max-width: fit-content;
		padding: 0.25rem 1rem;
		border-radius: 2rem;
	}

	.jam img {
		position: absolute;
		top: 50%;
		right: 1rem;
		max-width: 40rem;
		height: calc(min(12rem, 100% - 2rem));
		transform: translateY(-50%);
		object-fit: contain;
	}

	.button {
		width: 100%;
		box-sizing: border-box;
	}

	@media screen and (max-width: 1000px) {
		.jam {
			padding-right: 1rem;
			background-image: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, var(--status-color) 100%);
		}
		.jam img {
			max-width: 100%;
			height: auto;
			position: relative;
			transform: none;
			margin-bottom: 1rem;
		}

		.jam h2 {
			font-size: 1.75rem;
		}

		.counters {
			gap: 0.5rem 2rem;
			padding-inline: 0.5rem;
		}
		.counter {
			padding: 0.5rem 0.25rem;
			min-width: 4.5rem;
		}
		.counter .count {
			font-size: 1.25rem;
		}
		.counter .label {
			font-size: 0.8rem;
		}
		.counter::before {
			left: -1rem;
			width: 1rem;
		}
		.counter::after {
			right: -1rem;
			width: 1rem;
		}
	}
</style>