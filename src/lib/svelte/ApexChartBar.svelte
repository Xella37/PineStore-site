
<script>
	import { chart } from "svelte-apexcharts";

	export let title;
	export let dates;
	export let series;

	let options = {
		title: {
			text: title,
			align: "center",
			style: {
				fontSize:  "20px",
				fontWeight:  "bold",
			},
		},
		theme: {
			mode: "dark",
			palette: "palette1",
		},
		series: series,
		chart: {
			type: "bar",
			height: 400,
			stacked: true,
		},
		xaxis: {
			type: "datetime",
			categories: dates,
			labels: {
				formatter: function (value, timestamp) {
					if (typeof value == "string") return value;

					let d = new Date(timestamp);
					const options = {
						month: "long",
						day: "numeric",
					};
					return d.toLocaleDateString("en-US", options);
				}
			}
		},
		fill: {
			opacity: 1
		}
	};

</script>

{#if options != null}
	<div use:chart={options} />
{/if}