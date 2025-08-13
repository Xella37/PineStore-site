import { error } from "@sveltejs/kit";
import { getJam, getJamSubmission, getUser } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = getJam(params.id);
	let submissionData = getJamSubmission(params.id, params.projectId);

	submissionData = await submissionData;
	if (!submissionData.success)
		throw error(404, submissionData.error);
	let coOwnerIDs = submissionData.submission.co_owner_ids.filter(id => id.length > 0);
	let coOwners = [];
	for (const userId of coOwnerIDs)
		coOwners.push(getUser(userId));
	jamData = await jamData;
	coOwners = await Promise.all(coOwners);
	submissionData.submission.coOwners = coOwners.filter(coOwner => coOwner.success).map(res => res.user);

	if (!jamData.success)
		throw error(404, jamData.error);

	return {
		jam: jamData.jam,
		submission: submissionData.submission,
		scores_all: submissionData.scores_all,
	};
};
