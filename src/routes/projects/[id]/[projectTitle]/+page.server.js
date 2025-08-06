import { error } from "@sveltejs/kit";
import { getProject, getComments, getLastChangelog, getUser } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let projectData = getProject(params.id, cookies.get("session"));
	let commentData = getComments(params.id);
	let changelogData = getLastChangelog(params.id);

	projectData = await projectData;
	let coOwnerIDs = projectData.project.co_owner_ids.filter(id => id.length > 0);
	let coOwners = [];
	for (const userId of coOwnerIDs)
		coOwners.push(getUser(userId));
	commentData = await commentData;
	changelogData = await changelogData;
	coOwners = await Promise.all(coOwners);
	projectData.project.coOwners = coOwners.filter(coOwner => coOwner.success).map(res => res.user);

	if (!projectData.success)
		throw error(404, projectData.error);

	return {
		project: projectData.project,
		jam: projectData.jam,
		comments: commentData.comments,
		changelog: changelogData.changelog,
	};
};
