
<script>
	import { page } from "$app/stores";
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>{$page.status}: {$page.error?.message}</h1>
	</div>
</div>
