
<script>
	import { page } from "$app/stores";
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>{$page.status}: {$page.error?.message}</h1>

		{#if $page.status == 404}
			The user either does not exist, or has their profile set to no longer be public
		{/if}
	</div>
</div>
