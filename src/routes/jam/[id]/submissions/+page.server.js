import { error } from "@sveltejs/kit";
import { getJam, getJamSubmissions } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = getJam(params.id);
	let submissionsData = getJamSubmissions(params.id);

	jamData = await jamData;
	submissionsData = await submissionsData;

	if (!jamData.success)
		throw error(404, jamData.error);
	if (!submissionsData.success)
		throw error(404, submissionsData.error);

	return {
		jam: jamData.jam,
		submissions: submissionsData.submissions,
	};
};
