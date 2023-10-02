
<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import ToastManager from "$lib/ToastManager.svelte";
</script>

<Header />

<main>
	<slot />
</main>

<ToastManager />

<Footer />
