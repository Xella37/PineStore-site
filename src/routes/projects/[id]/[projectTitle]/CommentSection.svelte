
<script>
	import Modal from "$lib/svelte/Modal.svelte";
	import { BASE_URL, newComment, getComments, deleteComment, editComment } from "$lib/database.js";
	import { calcTimeAgo, addToast } from "$lib/util.js";
	import Markdown from "$lib/svelte/Markdown.svelte";

	export let project;
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
				if (replies[comment.reply_id])
					replies[comment.reply_id].push(comment);
				else
					replies[comment.reply_id] = [comment];
			} else {
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
		let commentData = await getComments(project.id);
		comments = commentData.comments;
		processComments();
	}

	let commentText = "";
	async function postComment() {
		let res = await newComment(project.id, null, commentText);
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
	async function postReply() {
		let res = await newComment(project.id, replyId, replyText);
		if (res.success) {
			replyId = null;
			replyText = "";
			await refreshComments();
			addToast("Sent!", "Your comment has been posted.", "success", 3);
		} else {
			addToast("Failed!", "Error: " + (res.error ?? "no error") + ", maybe you used illegal characters? 🤔", "error");
		}
	}

	let deleteId;
	let deleteCommentModal = false;
	async function deleteCommentSubmit() {
		let res = await deleteComment(deleteId);
		deleteCommentModal = false;
		if (res.success) {
			await refreshComments();
			addToast("Deleted!", "Your comment has been deleted.", "success", 3);
		} else {
			addToast("Failed!", "Error: " + (res.error ?? "no error"), "error");
		}
	}

	let editId;
	let editText = "";
	let editCommentModal = false;
	async function editCommentSubmit() {
		let res = await editComment(editId, editText);
		editCommentModal = false;
		if (res.success) {
			await refreshComments();
			addToast("Edited!", "Your comment has been updated.", "success", 3);
		} else {
			addToast("Failed!", "Error: " + (res.error ?? "no error"), "error");
		}
	}

	function formatCommentTimestamp(timestamp) {
		let dt = Date.now() - timestamp;
		if (dt <= 5000)
			return "just now";
		return `${calcTimeAgo(timestamp, true)} ago`;
	}

	function ctrlEnter(e) {
		return e.key == "Enter" && e.ctrlKey;
	}
</script>

{#if myId != null}
	<div class="writing-container" class:inactive={!selectedMainTextarea}>
		<form on:submit|preventDefault={postComment}>
			<a href="/user/{myId}">
				<img src="{BASE_URL}/pfp/{myId}.png" alt="pfp">
			</a>
			<textarea on:keydown={(e) => { ctrlEnter(e) && postComment() }} on:focus={() => { selectedMainTextarea = true; }} bind:value={commentText} placeholder="Write a new comment!" maxlength="500"></textarea>
			<button type="submit" class="button post">Post</button>
		</form>
	</div>
{:else}
	<div class="info-block">
		<i class="fa-solid fa-right-to-bracket"></i>
		You can <a href="https://discord.com/api/oauth2/authorize?client_id=1073728324142116948&redirect_uri=https%3A%2F%2Fpinestore.cc%2Fdiscordauth&response_type=code&scope=identify">login with Discord</a> to leave comments and reply to others!
	</div>
{/if}

<div id="commentSection">
	{#if rootComments.length == 0}
		<i class="no-comments">There are no comments yet</i>
	{/if}

	{#each rootComments as comment}
		<div class="comment">
			{#if comment.user_discord == "deleted"}
				<img src="/pfp-deleted.png" alt="pfp">
				<span class="comment-user">{comment.user_name}</span>
			{:else}
				<a href="/user/{comment.user_discord}">
					<img src="{BASE_URL}/pfp/{comment.user_discord}.png" alt="pfp">
				</a>
				<a href="/user/{comment.user_discord}" class="comment-user">{comment.user_name ?? "Unnamed"}</a>
			{/if}
				{#if comment.user_discord == project.owner_discord}<span class="comment-creator">Creator</span>{/if}
				<span class="comment-timestamp">{formatCommentTimestamp(comment.timestamp)}</span>
			<div class="action-buttons">
				{#if myId == comment.user_discord}
					<button class="delete-button" on:click={() => { deleteId = comment.id; deleteCommentModal = true; }}>
						<i class="fa-solid fa-trash-can"></i>
						Delete
					</button>
					<button class="edit-button" on:click={() => { editId = comment.id; editText = comment.body; editCommentModal = true; }}>
						<i class="fa-solid fa-pencil"></i>
						Edit
					</button>
				{/if}
				{#if myId != null && replyId != comment.id}
					<button class="reply-button" on:click={() => { replyId = comment.id; }}>
						<i class="fa-solid fa-reply"></i>
						Reply
					</button>
				{/if}
			</div>

			<p class="comment-body markdown-container" class:deleted={comment.user_discord == "deleted"}>
				<Markdown source="{comment.body.split("\n").join("\n\n")}" escaped={true} />
			</p>

			{#if myId != null}
				{#if replyId == comment.id}
					<div class="writing-container reply">
						<form on:submit|preventDefault={postReply}>
							<a href="/user/{myId}">
								<img src="{BASE_URL}/pfp/{myId}.png" alt="pfp">
							</a>
							<textarea on:keydown={(e) => { ctrlEnter(e) && postReply() }} bind:value={replyText} placeholder="Write a reply!" maxlength="500"></textarea>
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
							{#if reply.user_discord == "deleted"}
								<img src="/pfp-deleted.png" alt="pfp">
								<span class="comment-user">{reply.user_name}</span>
							{:else}
								<a href="/user/{reply.user_discord}">
									<img src="{BASE_URL}/pfp/{reply.user_discord}.png" alt="pfp">
								</a>
								<a href="/user/{reply.user_discord}" class="comment-user">{reply.user_name ?? "Unnamed"}</a>
							{/if}
								{#if reply.user_discord == project.owner_discord}<span class="comment-creator">Creator</span>{/if}
								<span class="comment-timestamp">{formatCommentTimestamp(reply.timestamp)}</span>
							<div class="action-buttons">
								{#if myId == reply.user_discord}
									<button class="delete-button" on:click={() => { deleteId = reply.id; deleteCommentModal = true; }}>
										<i class="fa-solid fa-trash-can"></i>
										Delete
									</button>
									<button class="edit-button" on:click={() => { editId = reply.id; editText = reply.body; editCommentModal = true; }}>
										<i class="fa-solid fa-pencil"></i>
										Edit
									</button>
								{/if}
							</div>
							<p class="comment-body markdown-container" class:deleted={reply.user_discord == "deleted"}>
								<Markdown source="{reply.body.split("\n").join("\n\n")}" escaped={true} />
							</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<Modal title="Delete comment" bind:opened={deleteCommentModal}>
	<p>Are you sure you want to delete your comment?</p>

	<form class="model-form" on:submit|preventDefault={deleteCommentSubmit}>
		<button type="submit" class="button red">Delete</button>
	</form>
</Modal>

<Modal title="Edit comment" bind:opened={editCommentModal}>
	<p>Update your comment below.</p>

	<form class="model-form" on:submit|preventDefault={editCommentSubmit}>
		<textarea bind:value={editText} placeholder="Write the updated message." maxlength="500"></textarea>
		<button type="submit" class="button">Finish</button>
	</form>
</Modal>

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
		width: 100%;
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
	.comment-creator {
		--color: var(--cc-lime);
		color: var(--color);
		/* font-size: 0.75rem; */
		margin: 0;
		margin-left: 0.75rem;
		border: 0.125rem solid var(--color);
		border-radius: 2rem;
		padding: 0.0625rem 0.5rem;
		padding-bottom: 0.125rem;
		transform: translateY(-0.25rem);
	}
	.comment-timestamp {
		margin-left: 0.75rem;
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
	.action-buttons {
		position: absolute;
		margin-left: 1rem;
		display: inline-flex;
		gap: 0.5rem;
		transform: translateY(0.25rem);
	}
	.delete-button {
		--color: var(--cc-red);
		display: none;
		background: none;
		color: var(--color);
		font-size: 0.75rem;
		margin: 0;
		border: 0.125rem solid var(--color);
		border-radius: 2rem;
		padding: 0.125rem 0.5rem;
	}
	.comment:hover > .action-buttons > .delete-button {
		display: unset;
	}
	.delete-button:hover {
		cursor: pointer;
		--color: var(--cc-orange);
	}
	.edit-button {
		--color: var(--cc-yellow);
		display: none;
		background: none;
		color: var(--color);
		font-size: 0.75rem;
		margin: 0;
		border: 0.125rem solid var(--color);
		border-radius: 2rem;
		padding: 0.125rem 0.5rem;
	}
	.comment:hover > .action-buttons > .edit-button {
		display: unset;
	}
	.edit-button:hover {
		cursor: pointer;
		--color: var(--cc-lime);
	}
	.reply-button {
		--color: var(--cc-lightBlue);
		display: none;
		background: none;
		color: var(--color);
		font-size: 0.75rem;
		margin: 0;
		border: 0.125rem solid var(--color);
		border-radius: 2rem;
		padding: 0.125rem 0.5rem;
	}
	.comment:hover .reply-button {
		display: unset;
	}
	.writing-container.reply {
		margin-block: 2rem;
	}
	.reply-button:hover {
		cursor: pointer;
		--color: var(--cc-blue);
	}
	.comment-replies {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
	}

	.model-form button {
		width: 100%;
	}

	.model-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>