
import { getProjects } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load() {
	let projectsData = await getProjects();
	return projectsData;
};
