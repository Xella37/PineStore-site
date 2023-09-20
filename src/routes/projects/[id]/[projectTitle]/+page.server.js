
import { getProject } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params }) {
	let projectData = await getProject(params.id);
	return projectData;
};
