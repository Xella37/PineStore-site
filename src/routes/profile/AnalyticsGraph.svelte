
<script>
    import { onMount } from "svelte";
    import ApexChartBar from "../../lib/svelte/ApexChartBar.svelte";
	import { getMyAnalytics } from "$lib/database.js";

	export let title = "Title";
	export let kind = "analytics";
	export let projects = [];

	let series;
	let dates;

	async function loadAnalytics() {
		let res = await getMyAnalytics(kind);

		let projectsMap = {};
		for (const project of projects)
			projectsMap[project.id] = project;

		let seriesMap = {};
		let newDates = [];
		for (const day of res.data) {
			let timestamp = day.timestamp;
			let analyticsData = day.data;

			newDates.push(timestamp);
			for (const id in analyticsData) {
				let count = analyticsData[id];
				if (!seriesMap[id])
					seriesMap[id] = [count];
				else
					seriesMap[id].push(count);
			}
		}
		let newSeries = [];
		for (const id in seriesMap) {
			let serie = seriesMap[id];
			newSeries.push({
				name: projectsMap[id]?.name || `Project ${id}`,
				data: serie,
			});
		}
		series = newSeries;
		dates = newDates;
	}

	onMount(() => {
		loadAnalytics();
	});
</script>

{#if series != null}
	<ApexChartBar series={series} dates={dates} title={title}  />
{/if}