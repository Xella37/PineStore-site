
import { getProjects } from "$lib/database.js";
import { error } from "@sveltejs/kit";

export const prerender = false;
export const ssr = true;

export async function load() {
	let projectsData = await getProjects();
	if (!projectsData.success)
		throw error(404, projectsData.error);
	return projectsData;
};
