
<script>
    export let imageLinks = [];

	let viewIndex = undefined;
	let viewImgSrc;
	let openedImg = Date.now();
	function viewImg(e) {
		openedImg = Date.now();
		viewIndex = e.target.getAttribute("data-index");
		viewImgSrc = imageLinks[viewIndex];
	}
	function closeImgView(e) {
		if (Date.now() > openedImg + 100)
			viewImgSrc = undefined;
	}
	function keypressed(e) {
		if (viewImgSrc) {
			if (e.key == "ArrowLeft" || e.key == "a") {
				viewIndex = (viewIndex - 1 + imageLinks.length) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			} else if (e.key == "ArrowRight" || e.key == "d") {
				viewIndex = (viewIndex + 1) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			} else {
				if (Date.now() > openedImg + 100)
					viewImgSrc = undefined;
			}
		}
	}
	function scrolled(e) {
		if (viewImgSrc) {
			e.preventDefault();
			if (e.wheelDeltaY > 0) {
				viewIndex = (viewIndex - 1 + imageLinks.length) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			} else if (e.wheelDeltaY < 0) {
				viewIndex = (viewIndex + 1) % imageLinks.length;
				viewImgSrc = imageLinks[viewIndex];
			}
		}
	}
</script>

{#if imageLinks.length > 0}
    <div id="imagesSection">
        {#each imageLinks as url, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <img data-index="{i}" src="{url}" class="shadow" on:click={viewImg} alt="project screenshot">
        {/each}
    </div>
{/if}

{#if viewImgSrc}
	<div id="imageViewBg"></div>
	<img id="imageView" src={viewImgSrc} alt="screenshot viewer" on:wheel={scrolled}>
{/if}

<svelte:window on:keydown={keypressed} on:click={closeImgView}/>

<style>
    #imagesSection {
		margin-top: 3rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
	}
	#imagesSection img {
		border-radius: 1rem;
		max-width: calc(50% - 0.5rem);
		object-fit: cover;
		cursor: pointer;
	}
	@media (max-width: 40rem) {
		#imagesSection img {
			max-width: 100%;
		}
	}

	#imageView {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		cursor: pointer;
	}
	#imageViewBg {
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.65);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>