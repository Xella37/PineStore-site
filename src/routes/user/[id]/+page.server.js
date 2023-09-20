
import { getUser, getUserProjects } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params }) {
	let userId = params.id;

	let userData = getUser(userId);
	let projectsData = getUserProjects(userId);

	userData = await userData;
	projectsData = await projectsData;

	return {
		user: userData.user,
		projects: projectsData.projects,
	};
};
