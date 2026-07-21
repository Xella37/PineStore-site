import { error } from "@sveltejs/kit";
import { getJams } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = await getJams(params.id);

	// console.log(jamData);

	if (!jamData.success)
		throw error(404, jamData.error);

	let jams = jamData.jams.map(jam => {
		let now = Date.now();
		let status = "unknown";
		if (now < jam.date_start)
			status = "starting";
		else if (now < jam.date_end)
			status = "ongoing";
		else if (!jam.judging_finished)
			status = "judging";
		else
			status = "results";
		
		return {
			id: jam.id,
			title: jam.title,
			date_start: jam.date_start,
			date_end: jam.date_end,
			judging_finished: jam.judging_finished,
			status: status,
		}
	}).sort((a, b) => {
		return b.date_start - a.date_start;
	});

	return {
		jams: jams,
	};
};
