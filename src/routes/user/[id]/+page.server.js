import { error } from "@sveltejs/kit";
import { getUser, getUserProjects } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params }) {
	let userId = params.id;

	let userData = getUser(userId);
	let projectsData = getUserProjects(userId);

	userData = await userData;
	projectsData = await projectsData;

	if (!userData.success)
		throw error(404, userData.error);
	if (!projectsData.success)
		throw error(404, projectsData.error);

	projectsData.projects = projectsData.projects.sort((a, b) => {
		return Math.max(b.date_publish, b.date_updated) - Math.max(a.date_publish, a.date_updated);
	});

	return {
		user: userData.user,
		projects: projectsData.projects,
	};
};
