
<script>
	import { page } from "$app/stores";
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>{$page.status}: {$page.error?.message}</h1>

		{#if $page.status === 404}
			<p>The project for this submission might be private (not published), is deleted or could otherwise not be found.</p>
		{:else if $page.status === 500}
			<p>There was an internal server error. Please try again later.</p>
		{:else}
			<p>An unexpected error occurred. Please try again later.</p>
		{/if}
	</div>
</div>
