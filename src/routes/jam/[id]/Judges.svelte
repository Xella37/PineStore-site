
<script>
	import { BASE_URL } from "$lib/database.js";

	export let judges = [];
</script>

<div class="judges">
	{#each judges as judge}
		<a href={`/user/${judge.discord_id}`} class="no-link">
			<div class="judge">
				<img src={`${BASE_URL}/pfp/${judge.discord_id}.png`} alt={judge.name} on:error={e => e.target.src = "/pfp-placeholder.png"}>
				<span class="judge-name">{judge.name}</span>
			</div>
		</a>
	{/each}
</div>

<style>
	.judges {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
		margin-top: 2rem;
	}
	.judge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: transform 0.2s ease;
	}
	.judge:hover {
		transform: translateY(-0.25rem);
	}
	.judge img {
		border-radius: 100%;
		max-width: 6rem;
	}
	.judge-name {
		color: var(--text-color-medium);
		font-size: 1.25rem;
	}

	@media (max-width: 530px) {
		.judges {
			gap: 1rem;
			flex-direction: column;
			align-items: center;
		}
		.judge {
			flex-direction: row;
			gap: 1rem;
		}
		.judge img {
			max-width: 3rem;
		}
	}
</style>