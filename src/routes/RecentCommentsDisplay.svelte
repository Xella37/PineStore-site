
<script>
	import { BASE_URL } from "$lib/database.js";
	import Markdown from "$lib/svelte/Markdown.svelte";
	import { calcTimeAgo, getProjectLink } from "$lib/util.js";

	export let recentComments;
	
	let comments = recentComments.comments ?? [];
	let parentComment = {};
	let parentComments = recentComments.parentComments;

	parentComments.forEach(comment => {
		parentComment[comment.id] = comment;
	});
	comments = comments.filter(c => parentComment[c.id] == null && c.user_discord != "deleted");

	// starting count
	let displayCount = 3;

	function formatCommentTimestamp(timestamp) {
		let dt = Date.now() - timestamp;
		if (dt <= 5000)
			return "just now";
		return `${calcTimeAgo(timestamp, true)} ago`;
	}
</script>

<div id="commentSection">
	{#each comments.slice(0, displayCount) as comment}
		<div class="comment-container">
			<a href="{getProjectLink(comment.Project.id, comment.Project.name)}#commentSection" class="no-link">
				<div class="project-thumbnail-container">
					<img src="{BASE_URL}/project/{comment.project_id}/thumbnail.webp" alt="project thumb">
				</div>
			</a>
			{#if comment.reply_id != null}
				{@const parent = parentComment[comment.reply_id]}

				<div class="comment parent">
					<div class="line-block"></div>
					{#if parent.user_discord == "deleted"}
						<img src="/pfp-deleted.png" alt="pfp">
						<span class="comment-user">{parent.user_name}</span>
					{:else}
						<a href="/user/{parent.user_discord}">
							<img src="{BASE_URL}/pfp/{parent.user_discord}.png" alt="pfp">
						</a>
						<a href="/user/{parent.user_discord}" class="comment-user">{parent.user_name ?? "Unnamed"}</a>
					{/if}
					<span class="comment-timestamp">{formatCommentTimestamp(parent.timestamp)}</span>

					<p class="comment-body markdown-container" class:deleted={parent.user_discord == "deleted"}>
						<Markdown source="{parent.body.split("\n").join("\n\n")}" escaped={true} />
					</p>
				</div>
			{/if}
			<div class="comment" class:is-reply={comment.reply_id != null}>
				{#if comment.user_discord == "deleted"}
					<img src="/pfp-deleted.png" alt="pfp">
					<span class="comment-user">{comment.user_name}</span>
				{:else}
					<a href="/user/{comment.user_discord}">
						<img src="{BASE_URL}/pfp/{comment.user_discord}.png" alt="pfp">
					</a>
					<a href="/user/{comment.user_discord}" class="comment-user">{comment.user_name ?? "Unnamed"}</a>
				{/if}
				<span class="comment-timestamp">{formatCommentTimestamp(comment.timestamp)}</span>

				<p class="comment-body markdown-container" class:deleted={comment.user_discord == "deleted"}>
					<Markdown source="{comment.body.split("\n").join("\n\n")}" escaped={true} />
				</p>
			</div>
		</div>
	{/each}

	{#if displayCount < comments.length}
		<button class="button showmore" on:click|preventDefault={() => { displayCount = displayCount + 5; }}>
			Show more comments
		</button>
	{/if}
</div>

<style>
	#commentSection {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		border: 0.25rem var(--cc-gray) solid;
		border-radius: 1rem;
		padding: 1rem;
		box-sizing: border-box;
	}

	.comment-container {
		position: relative;
		padding-left: 12rem;
		min-height: 6rem;
	}
	.project-thumbnail-container {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 10rem;
		aspect-ratio: 1.78889;
		border-radius: 0.5rem;
		overflow: hidden;
	}
	.project-thumbnail-container img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.comment {
		position: relative;
		padding-left: 5em;
		min-height: 4em;
	}
	.comment img {
		position: absolute;
		left: 0;
		top: 0;
		width: 4em;
		border-radius: 10rem;
	}
	.comment-user {
		font-size: 1.25em;
		color: white;
	}
	.comment-timestamp {
		margin-left: 0.75em;
		color: var(--text-color-dark);
	}
	.comment-body {
		display: block;
		margin-bottom: 0.5rem;
	}
	:global(.comment-body p) {
		margin-block: 0.37rem;
	}
	.comment-body.deleted {
		font-style: italic;
		color: var(--text-color-dark);
	}

	.comment.parent {
		font-size: 0.75rem;
		margin-bottom: 0.5em;
		margin-left: 5rem;
	}
	.comment.parent .comment-body {
		display: -webkit-box;
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-top: 0;
	}
	.comment.is-reply {
	}
	.comment-container .line-block {
		position: absolute;
		top: 1rem;
		left: -1rem;
		width: 2rem;
		height: 1.5rem;
		transform: translateX(-100%);
		border-left: solid var(--cc-lightGray) 0.25rem;
		border-top: solid var(--cc-lightGray) 0.25rem;
		border-top-left-radius: 1rem;
	}

	.button.showmore {
		margin-top: 1rem;
	}

	@media (max-width: 550px) {
		#commentSection {
			gap: 1.5rem;
		}

		.comment-container {
			padding-left: 0;
			padding-top: 6rem;
		}
		.project-thumbnail-container {
			position: absolute;
			top: 0;
			left: 0;
			transform: unset;
			width: 100%;
			aspect-ratio: unset;
			height: 5.5rem;
			border-radius: 0.5rem;
			overflow: hidden;

			
		}
	}
</style>