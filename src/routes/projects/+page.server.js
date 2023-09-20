
import { getProjects } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ url, params }) {
	let urlParams = url.searchParams;
	let sort = urlParams.get("sort");
	let selectedTag = urlParams.get("tag");

	let projectsData = await getProjects();
	return {sort, selectedTag, ...projectsData};
};
