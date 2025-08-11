
<script>
	import { fade } from "svelte/transition";
	import { isLoggedIn, getNotifications, hasUnreadNotifications, getJams } from "$lib/database.js";
	import { getProjectLink, calcTimeAgo } from "$lib/util.js";
    import { onMount } from "svelte";

	const loginURL = `https://discord.com/api/oauth2/authorize?client_id=1073728324142116948&redirect_uri=https%3A%2F%2Fpinestore.cc%2Fdiscordauth&response_type=code&scope=identify`;

	let mobileHeaderOpen = false;
	function toggleHeader() {
		mobileHeaderOpen = !mobileHeaderOpen;
	}

	function closeHeader() {
		mobileHeaderOpen = false;
	}

	let unreadNotifications = false;
	let notifications = null;
	let notificationsOpened = false;
	async function loadNotifications() {
		notifications = null;
		let notiData = await getNotifications();
		let notis = notiData.notifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);
		notis.forEach(noti => { noti.payload = JSON.parse(noti.payload) });
		notifications = notis;
	}

	function toggleNotifications() {
		notificationsOpened = !notificationsOpened;
		unreadNotifications = false;
		if (notificationsOpened)
			loadNotifications();
	}

	let jamStatus;
	let jamData;
	let loggedIn = false;
	onMount(async () => {
		let res = await getJams();
		if (res.success) {
			let now = Date.now();
			let MS_DAY = 1000 * 60 * 60 * 24;
			for (const jam of res.jams) {
				if (now > jam.date_start - MS_DAY * 7 * 8) {
					jamData = jam;
					if (now < jam.date_start) {
						// starting soon
						jamStatus = "starting";
						break;
					} else if (now < jam.date_end) {
						// ongoing
						jamStatus = "ongoing";
						break;
					} else if (!jam.judging_finished) {
						// judging in progress
						jamStatus = "judging";
						break;
					} else if (now < jam.date_end + MS_DAY * 7 * 4) {
						// results are in!
						jamStatus = "results";
						break;
					}
				}
			}
			console.log({
				jamData,
				jamStatus,
			})
		}

		loggedIn = await isLoggedIn();
		let newNotiData = await hasUnreadNotifications();
		unreadNotifications = newNotiData.unread;
		// toggleNotifications();
	});
</script>

<div id="headerContainer">
	<div id="mobileHeader" class="shadow">
		<button id="menuButton" on:click={toggleHeader} aria-label="navigation button"><i class="fa-solid fa-bars"></i></button>
		<a class="no-link" href="/">
			<div class="mobile-header-item">
				PineStore
			</div>
		</a>
		<a class="no-link" href="{loggedIn ? "/profile" : loginURL}" on:click={closeHeader} name="profile">
			<div class="mobile-header-item profile">
				<i class="fa-solid fa-user"></i>
			</div>
		</a>
	</div>

	<div id="headerItems" class="shadow" class:mobile-open={mobileHeaderOpen}>
		<a class="no-link" href="/" on:click={closeHeader}>
			<div class="header-item">
				<i class="fa-solid fa-house"></i>
				<span>Home</span>
			</div>
		</a>
		<a class="no-link" href="/projects" on:click={closeHeader}>
			<div class="header-item">
				<i class="fa-solid fa-bars-staggered"></i>
				<span>Projects</span>
			</div>
		</a>
		<!-- <a class="no-link" href="/uploading" on:click={closeHeader}>
			<div class="header-item">
				<i class="fa-solid fa-arrow-up-from-bracket"></i>
				<span>Upload</span>
			</div>
		</a> -->
		<a class="no-link" href="/documentation" on:click={closeHeader}>
			<div class="header-item">
				<i class="fa-solid fa-book"></i>
				<span>Docs</span>
			</div>
		</a>
		<a class="no-link" href="/search" on:click={closeHeader}>
			<div class="header-item">
				<i class="fa-solid fa-magnifying-glass"></i>
				<span>Search</span>
			</div>
		</a>

		{#if !mobileHeaderOpen}
			{#if loggedIn}
				<a class="no-link" href="/profile" on:click={closeHeader}>
					<div class="header-item">
						<i class="fa-solid fa-user"></i>
						<span>Profile</span>
					</div>
				</a>
			{:else}
				<a class="no-link" href="{loginURL}" on:click={closeHeader}>
					<div class="header-item call-to-action">
						<i class="fa-brands fa-discord"></i>
						<span>Login</span>
						<div class="rainbow"></div>
					</div>
				</a>
			{/if}
		{/if}
		
		{#if loggedIn}
			<div class="notificication-button-container">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="header-item notifications" on:click={toggleNotifications} class:unread={unreadNotifications}>
					<i class="fa-solid fa-bell"></i>
					<span>Notifications</span>
				</div>

				{#if notificationsOpened}
					<div class="notifications-container shadow">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="notifications-close-button" on:click={() => { notificationsOpened = false; }}>
							<i class="fa-solid fa-xmark"></i>
						</div>
						{#if notifications == null}
							<i class="loading-icon fa-solid fa-arrow-rotate-right"></i>
						{:else}
							{#if notifications.length <= 0}
								<i class="no-notifications">No notifications</i>
							{/if}
							{#each notifications as noti}
								{#if noti.kind == "comment"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="https://pinestore.cc/pfp/{noti.payload.from_id ?? "???"}.png" alt="pfp">
											{noti.payload.from_name} / {noti.payload.project_name} <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.short_text + (noti.payload.short_text.length == 50 ? "..." : "")}</p>
										</div>
									</a>
								{:else if noti.kind == "reply"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="https://pinestore.cc/pfp/{noti.payload.from_id}.png" alt="pfp">
											{noti.payload.from_name} <span style="color:var(--text-color-medium);">replied to you</span> <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.short_text + (noti.payload.short_text.length == 50 ? "..." : "")}</p>
										</div>
									</a>
								{:else if noti.kind == "newfollow_user"}
									<a class="no-link" href="https://pinestore.cc/user/{noti.payload.user_id}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="https://pinestore.cc/pfp/{noti.payload.user_id}.png" alt="pfp">
											New follower! <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.user_name} is now following you!</p>
										</div>
									</a>
								{:else if noti.kind == "newfollow_project"}
									<a class="no-link" href="https://pinestore.cc/user/{noti.payload.user_id}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="https://pinestore.cc/pfp/{noti.payload.user_id}.png" alt="pfp">
											Saved / {noti.payload.project_name} <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.user_name} saved your project!</p>
										</div>
									</a>
								{:else if noti.kind == "milestone_views"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="/tada.webp" alt="tada">
											Congratulations on {noti.payload.views} views! <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.project_name} just reached <b>{noti.payload.views}</b> views!</p>
										</div>
									</a>
								{:else if noti.kind == "milestone_downloads"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="/tada.webp" alt="tada">
											Congratulations on {noti.payload.downloads} downloads! <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.project_name} just reached <b>{noti.payload.downloads}</b> downloads!</p>
										</div>
									</a>
								{:else if noti.kind == "milestone_likes"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="/tada.webp" alt="tada">
											Congratulations on {noti.payload.likes} likes! <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.project_name} just reached <b>{noti.payload.likes}</b> likes!</p>
										</div>
									</a>
								{:else if noti.kind == "following_newproject"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="https://pinestore.cc/pfp/{noti.payload.user_id}.png" alt="pfp">
											{noti.payload.user_name} published {noti.payload.project_name} <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.user_name} published a new project!</p>
										</div>
									</a>
								{:else if noti.kind == "following_projectupdate"}
									<a class="no-link" href="{getProjectLink(noti.payload.project_id, noti.payload.project_name)}" on:click={toggleNotifications}>
										<div class="notification-item" class:unread={!noti.was_read}>
											<img src="https://pinestore.cc/pfp/{noti.payload.user_id}.png" alt="pfp">
											{noti.payload.project_name} has been updated! <span class="notification-time">{calcTimeAgo(noti.timestamp)}</span>
											<p>{noti.payload.user_name} updated the project.</p>
										</div>
									</a>
								{/if}
							{/each}
						{/if}
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="notifications-close-box" on:click={() => { notificationsOpened = false; }}>
					</div>
				{/if}
				<div class="rainbow"></div>
			</div>
		{/if}

		<div class="mobile-rainbow"></div>
	</div>

	{#if mobileHeaderOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div id="closeBox" on:click={closeHeader} transition:fade={{duration: 150}}></div>
	{/if}

	{#if jamStatus != null}
		<a href="/jam/{jamData.id}" class="no-link">
			<div class="jam-banner shadow">
				{#if jamStatus == "starting"}
					{jamData.title} is starting soon!
				{:else if jamStatus == "ongoing"}
					{jamData.title} is currently ongoing
				{:else if jamStatus == "judging"}
					Judging is in progress for {jamData.title}
				{:else if jamStatus == "results"}
					The {jamData.title} results are in!
				{/if}
				<i class="fa-solid fa-chevron-right"></i>
			</div>
		</a>
	{/if}
</div>

<style>
	#headerContainer {
		position: relative;
	}

	#headerItems {
		position: relative;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding: 1rem;
		background-color: #444;
		gap: 1.5rem 3rem;
		padding-left: 2rem;
		padding-right: 2rem;
		z-index: 15;
	}

	.jam-banner {
		position: relative;
		z-index: 10;
		background-color: var(--cc-green);
		padding: 1rem 2rem;
		font-size: 1.5rem;
		text-align: center;
		color: white;
		transition: background-color ease 200ms;
	}
	.jam-banner:hover {
		background-color: var(--cc-cyan);
	}

	/* RAINBOW */
	.rainbow {
		position: absolute;
		right: -1rem;
		top: -1rem;
		bottom: -1rem;
		width: 12rem;
		transform: translateX(100%);
		background: linear-gradient(110deg, 
                transparent 0%,
                transparent 20%,
                #CC4C4C 20%, #CC4C4C 30%,
                #F2B233 30%, #F2B233 40%,
                #DEDE6C 40%, #DEDE6C 50%,
                #7FCC19 50%, #7FCC19 60%,
                #99B2F2 60%, #99B2F2 70%,
                #B266E5 70%, #B266E5 80%,
                transparent 80%);
	}
	.mobile-rainbow {
		display: none;
	}
	@media (max-width: 65rem) {
		.rainbow {
			display: none;
		}
		/* .rainbow {
			position: relative;
			height: 4rem;
		} */
		.mobile-rainbow {
			position: relative;
			display: block;
			height: 12rem;
			left: -2rem;
			width: calc(100% + 4rem);
			/* position: absolute;
			right: -1rem;
			top: -1rem;
			bottom: -1rem; */
			/* width: 12rem; */
			/* transform: translateX(100%); */
			background: linear-gradient(175deg, 
					transparent 0%,
					transparent 20%,
					#CC4C4C 20%, #CC4C4C 30%,
					#F2B233 30%, #F2B233 40%,
					#DEDE6C 40%, #DEDE6C 50%,
					#7FCC19 50%, #7FCC19 60%,
					#99B2F2 60%, #99B2F2 70%,
					#B266E5 70%, #B266E5 80%,
					transparent 80%);
		}
	}

	.header-item {
		position: relative;
		color: white;
		font-size: 1.5rem;
		padding: 1.5rem;
		padding-block: 0.5rem;
	}
	.header-item i {
		margin-right: 1rem;
	}
	.header-item.notifications {
		cursor: pointer;
	}
	.header-item.notifications i {
		margin: 0;
	}

	.header-item::after {
		display: block;
		content: " ";
		background-color: var(--cc-lightGray);
		border-radius: 1rem;
		position: absolute;
		bottom: 0rem;
		height: 0.25rem;
		left: 50%;
		right: 50%;
		opacity: 0;
		transition: all ease 200ms;
	}
	.header-item:hover::after {
		opacity: 1;
		left: 1rem;
		right: 1rem;
		outline: none;
	}
	a:focus {
		outline: none;
	}
	a:focus .header-item::after {
		opacity: 1;
		left: 0;
		right: 0;
	}

	.call-to-action {
		/* background-color: var(--cc-blue); */
		background-color: #333;
		border-radius: 1rem;
		/* box-shadow: rgba(0, 0, 0, 0.5) 0rem 0.125rem 1rem 0rem inset; */
		box-shadow: rgba(0, 0, 0, 0.25) 0rem 0.125rem 1rem 0rem inset;
		transition: all ease 200ms;
		padding-inline: 1rem;
	}
	a:focus .call-to-action, .call-to-action:hover {
		/* transform: scale(1.04); */
		background-color: var(--cc-blue);
		box-shadow: rgba(0, 0, 0, 0) 0rem 0rem 0rem 0rem inset;
	}
	a:focus .call-to-action::after, .call-to-action:hover::after {
		display: none;
	}

	#mobileHeader {
		display: none;
	}
	.mobile-header-item {
		color: var(--text-color);
		display: inline-block;
		font-size: 2rem;
		padding: 1rem;
	}
	.mobile-header-item.profile {
		padding-right: 2rem;
	}
	#menuButton {
		background: none;
		border: none;
		color: var(--text-color);
		font-size: 2rem;
		padding: 1rem;
		padding-left: 2rem;
	}
	#closeBox {
		position: absolute;
		z-index: 8;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 65rem) {
		#headerContainer {
			position: sticky;
			top: 0;
			z-index: 100;
		}
		#headerItems {
			position: absolute;
			justify-content: start;
			flex-direction: column;
			z-index: 9;
			transform: translateX(-110%);
			transition: transform ease 200ms;
			height: calc(100vh - 8rem);
			top: 0;
			padding-top: 7rem;
			flex-wrap: nowrap;
		}
		#headerItems.mobile-open {
			transform: translateX(0%);
		}

		#mobileHeader {
			position: relative;
			display: flex;
			justify-content: space-between;
			padding: 0;
			background-color: #444;
			z-index: 10;
		}

		/* JAM HEADER / REMOVE AFTER JAM */
		#headerItems {
			height: calc(100vh - 11rem);
			padding-top: 10rem;
		}
	}

	.notifications::after {
		display: none!important;
	}
	.notifications.unread {
		color: var(--cc-orange);
	}
	.notifications.unread::before {
		content: "";
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 100vw;
		width: 2.5rem;
		height: 2.5rem;
		border: solid 0.25rem var(--cc-orange);
	}
	.notifications span {
		display: none;
	}

	.notificication-button-container {
		position: relative;
	}
	.notifications-close-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10;
	}
	.notifications-close-button {
		display: none;
	}
	.notifications-container {
		position: absolute;
		z-index: 20;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		top: 3.5rem;
		right: 0;
		min-width: 22rem;
		min-height: 3rem;
		background-color: var(--cc-gray);
		padding-block: 1rem;
		border-radius: 1rem;
		max-height: 20rem;
		overflow-y: auto;
	}
	.notification-item {
		position: relative;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		padding-right: 2rem;
		padding-left: 5rem;
		white-space: nowrap;
		overflow-x: hidden;
	}
	.notification-item.unread {
		background-color: rgba(255, 255, 255, 0.05);
	}
	.notification-item.unread::after {
		content: "";
		background-color: var(--cc-orange);
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0.5rem;
		border-top-right-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}
	.notification-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	.notification-item img {
		position: absolute;
		top: 0.5rem;
		left: 1rem;
		width: 3rem;
		border-radius: 10rem;
	}
	.notification-item p {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		color: var(--text-color);
		margin-bottom: 0.25rem;
		text-overflow: ellipsis;
		max-width: calc(20rem - 3rem);
		overflow: hidden;
		white-space: break-spaces;
	}
	.notification-time {
		color: var(--text-color-dark);
		margin-left: 0.5rem;
	}

	@keyframes spinning {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	.loading-icon {
		position: absolute;
		left: 50%;
		top: 50%;
		font-size: 2rem;
		transform: translate(-50%, -50%);
		animation: spinning linear 1000ms infinite;
	}

	.no-notifications {
		text-align: center;
		margin: auto;
	}

	@media (max-width: 65rem) {
		.notifications-container {
			display: none;
			position: fixed;
			top: 4.4rem;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 200;
			border-radius: 0;
			max-height: unset;
			max-width: unset;
			width: 100vw;
		}

		#headerItems.mobile-open .notifications-container {
			display: unset;
		}

		.notifications-close-button {
			display: unset;
			position: absolute;
			z-index: 200;
			top: 0;
			right: 0;
			font-size: 2rem;
			padding: 1rem 2rem;
		}

		.notifications.unread::before {
			left: 2.5ch;
		}

		.notifications i {
			margin-right: 1rem!important;
		}

		.notifications span {
			display: unset;
		}

		.notifications::after {
			display: unset!important;
		}
	}
</style>
