
<script>
	import { fade } from "svelte/transition";

	let mobileHeaderOpen = false;
	function toggleHeader() {
		mobileHeaderOpen = !mobileHeaderOpen;
	}

	function closeHeader() {
		mobileHeaderOpen = false;
	}
</script>

<div id="headerContainer">
	<div id="mobileHeader" class="shadow">
		<button id="menuButton" on:click={toggleHeader}><i class="fa-solid fa-bars"></i></button>
		<a class="no-link" href="/">
			<div class="mobile-header-item">
				PineStore
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
		<a class="no-link" href="/uploading" on:click={closeHeader}>
			<div class="header-item">
				<i class="fa-solid fa-arrow-up-from-bracket"></i>
				<span>Upload</span>
			</div>
		</a>
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
	</div>

	{#if mobileHeaderOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div id="closeBox" on:click={closeHeader} transition:fade={{duration: 150}}></div>
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
		padding: 2rem;
		background-color: #444;
		gap: 1.5rem 6rem;
		padding-left: 2rem;
		padding-right: 2rem;
		z-index: 10;
	}

	.header-item {
		position: relative;
		color: white;
		font-size: 1.5rem;
	}
	.header-item i {
		margin-right: 1rem;
	}

	.header-item::after {
		display: block;
		content: " ";
		background-color: var(--cc-lightGray);
		border-radius: 1rem;
		position: absolute;
		bottom: -0.5rem;
		height: 0.25rem;
		left: 50%;
		right: 50%;
		opacity: 0;
		transition: all ease 200ms;
	}
	.header-item:hover::after {
		opacity: 1;
		left: -1rem;
		right: -1rem;
		outline: none;
	}
	a:focus {
		outline: none;
	}
	a:focus .header-item::after {
		opacity: 1;
		left: -1rem;
		right: -1rem;
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
	#menuButton {
		background: none;
		border: none;
		color: var(--text-color);
		font-size: 2rem;
		padding: 1rem;
		padding-left: 2rem;
		padding-right: 2rem;
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
			height: calc(100vh - 9rem);
			top: 0;
			padding-top: 7rem;
		}
		#headerItems.mobile-open {
			transform: translateX(0%);
		}

		#mobileHeader {
			position: relative;
			display: block;
			padding: 0;
			background-color: #444;
			z-index: 10;
		}
	}
</style>
