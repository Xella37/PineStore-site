
<script>
	import { BASE_URL } from "$lib/database.js";

	export let jam;

	function formatShortDate(d) {
		let projectDate = new Date(d);
		return projectDate.toLocaleDateString("en-US", {
			hour: "numeric",
			minute: "numeric",
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

<a href="/jam/{jam.id}" class="no-link">
	<div class="jam" class:status-starting={jam.status === "starting"} class:status-ongoing={jam.status === "ongoing"} class:status-judging={jam.status === "judging"} class:status-results={jam.status === "results"}>
		<img src="{BASE_URL}/{jam.id}.png" alt="Banner for {jam.title}" class="jam-logo" />

		<h2>{jam.title}</h2>
		<span class="period">{formatShortDate(jam.date_start)} / {formatShortDate(jam.date_end)}</span>
		<span class="status">{STATUS_MAP[jam.status]}</span>
	</div>
</a>

<style>
	.jam {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* min-height: 8rem; */
		--status-color: #FFF;
		border-radius: 1rem;
		padding: 1rem;
		padding-right: 22rem;
	}
	.jam:hover {
		background-color: var(--cc-gray);
	}

	.jam.status-starting {
		--status-color: var(--cc-green);
	}
	.jam.status-ongoing {
		--status-color: var(--cc-green);
	}
	.jam.status-judging {
		--status-color: var(--cc-cyan);
	}
	.jam.status-results {
		--status-color: var(--cc-blue);
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
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.jam span.period {
		color: var(--text-color-dark);
	}

	.jam span.status {
		display: block;
		margin-top: 1rem;
		color: var(--text-color);
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
		max-width: 20rem;
		height: calc(min(8rem, 100% - 2rem));
		transform: translateY(-50%);
		object-fit: contain;
	}

	@media screen and (max-width: 700px) {
		.jam {
			padding-right: unset;
		}
		.jam img {
			max-width: 100%;
			height: auto;
			position: relative;
			transform: none;
			margin-bottom: 1rem;
		}
	}
</style>