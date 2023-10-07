
<script>
	import { BASE_URL, newComment, getComments } from "$lib/database.js";
	import { calcTimeAgo, addToast } from "$lib/util.js";

	export let projectId;
	export let comments;
	export let myId;

	let selectedMainTextarea = false;

	let rootComments = [];
	let replies = {};

	function processComments() {
		rootComments = [];
		replies = {};

		for (const comment of comments) {
			if (comment.reply_id != null) {
				console.log(`Reply to ${comment.reply_id}`);
				if (replies[comment.reply_id])
					replies[comment.reply_id].push(comment);
				else
					replies[comment.reply_id] = [comment];
			} else {
				console.log("Root comment");
				rootComments.push(comment);
			}
		}

		rootComments = rootComments.sort((a, b) => {
			return a.timestamp < b.timestamp;
		});
	}
	$: if (comments) {
		processComments();
	}

	async function refreshComments() {
		let commentData = await getComments(projectId);
		comments = commentData.comments;
		processComments();
	}

	let commentText = "";
	async function postComment(e) {
		e.preventDefault();
		let res = await newComment(projectId, null, commentText);
		if (res.success) {
			commentText = "";
			await refreshComments();
			addToast("Sent!", "Your comment has been posted.", "success", 3);
		} else {
			addToast("Failed!", "Error: " + (res.error ?? "no error") + ", maybe you used illegal characters? 🤔", "error");
		}
	}

	let replyId;
	let replyText;
	async function postReply(e) {
		e.preventDefault();
		let res = await newComment(projectId, replyId, replyText);
		if (res.success) {
			replyId = null;
			replyText = "";
			await refreshComments();
			addToast("Sent!", "Your comment has been posted.", "success", 3);
		} else {
			addToast("Failed!", "Error: " + (res.error ?? "no error") + ", maybe you used illegal characters? 🤔", "error");
		}
	}

	function formatCommentTimestamp(timestamp) {
		return `${calcTimeAgo(timestamp, true)} ago`;
	}
</script>

{#if myId != null}
	<div class="writing-container" class:inactive={!selectedMainTextarea}>
		<form on:submit={postComment}>
			<a href="/user/{myId}">
				<img src="{BASE_URL}/pfp/{myId}.png" alt="pfp">
			</a>
			<textarea on:focus={() => { selectedMainTextarea = true; }} bind:value={commentText} placeholder="Write a new comment!" maxlength="500"></textarea>
			<button type="submit" class="button post">Post</button>
		</form>
	</div>
{/if}

<div id="commentSection">
	{#if rootComments.length == 0}
		<i class="no-comments">There are no comments yet</i>
	{/if}

	{#each rootComments as comment}
		<div class="comment">
			<a href="/user/{comment.user_discord}">
				<img src="{BASE_URL}/pfp/{comment.user_discord}.png" alt="pfp">
			</a>
			<a href="/user/{comment.user_discord}" class="comment-user">{comment.user_name ?? "Unnamed"}</a><span class="comment-timestamp">{formatCommentTimestamp(comment.timestamp)}</span>
			<button class="reply-button" on:click={() => { replyId = comment.id; }}>
				<i class="fa-solid fa-reply"></i>
				Reply
			</button>

			<p class="comment-body">
				{#each comment.body.split("\n") as line}
					{line}
					<br>
				{/each}
			</p>

			{#if myId != null}
				{#if replyId == comment.id}
					<div class="writing-container reply">
						<form on:submit={postReply}>
							<a href="/user/{myId}">
								<img src="{BASE_URL}/pfp/{myId}.png" alt="pfp">
							</a>
							<textarea bind:value={replyText} placeholder="Write a reply!" maxlength="500"></textarea>
							<button type="submit" class="button post">Post</button>
							<button on:click|preventDefault={() => { replyId = null; }} class="button gray close">Close</button>
						</form>
					</div>
				{/if}
			{/if}

			{#if replies[comment.id]?.length > 0}
				<div class="comment-replies">
					{#each replies[comment.id] as reply}
						<div class="comment">
							<a href="/user/{reply.user_discord}">
								<img src="{BASE_URL}/pfp/{reply.user_discord}.png" alt="pfp">
							</a>
							<a href="/user/{reply.user_discord}" class="comment-user">{reply.user_name ?? "Unnamed"}</a><span class="comment-timestamp">{formatCommentTimestamp(reply.timestamp)}</span>
							<p class="comment-body">
								{#each reply.body.split("\n") as line}
									{line}
									<br>
								{/each}
							</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.writing-container {
		position: relative;
		padding-left: 6rem;
		min-height: 5rem;
	}
	.writing-container textarea {
		min-height: 5rem;
	}
	.writing-container img {
		position: absolute;
		left: 0;
		top: 0;
		width: 5rem!important;
		border-radius: 10rem;
	}
	.writing-container button.post {
		float: right;
		margin-top: 0.5rem;
	}
	.writing-container button.close {
		float: right;
		margin-top: 0.5rem;
		margin-right: 0.5rem;
	}

	.writing-container.inactive textarea {
		min-height: 3rem;
		height: 3rem;
	}
	.writing-container.inactive button.post {
		display: none;
	}

	.no-comments {
		color: var(--text-color-dark);
		text-align: center;
	}

	#commentSection {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	.comment {
		position: relative;
		padding-left: 5rem;
		min-height: 4rem;
	}
	.comment img {
		position: absolute;
		left: 0;
		top: 0;
		width: 4rem;
		border-radius: 10rem;
	}
	.comment-user {
		font-size: 1.25rem;
		color: white;
	}
	.comment-timestamp {
		margin-left: 1rem;
		color: var(--text-color-dark);
	}
	.comment-body {
		display: block;
		margin-bottom: 0.5rem;
	}
	.reply-button {
		display: none;
		border: none;
		background: none;
		color: var(--cc-lightBlue);
		font-size: 0.75rem;
		padding: 0;
		margin: 0;
		margin-left: 0.5rem;
	}
	.comment:hover .reply-button {
		display: unset;
	}
	.writing-container.reply {
		margin-block: 2rem;
	}
	.reply-button:hover {
		text-decoration: underline;
	}
	.comment-replies {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
	}
</style>