import { error } from "@sveltejs/kit";
import { getJam, getJamSubmission } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = getJam(params.id);
	let submissionData = getJamSubmission(params.id, params.projectId);

	jamData = await jamData;
	submissionData = await submissionData;

	if (!jamData.success)
		throw error(404, jamData.error);
	if (!submissionData.success)
		throw error(404, submissionData.error);

	return {
		jam: jamData.jam,
		submission: submissionData.submission,
	};
};
