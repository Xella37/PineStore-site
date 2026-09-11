
import { getProjects, getJams, getCommentsRecent } from "$lib/database.js";
import { error } from "@sveltejs/kit";

export const prerender = false;
export const ssr = true;

export async function load() {
	let projectsData = getProjects();
	let jamsData = getJams();
	let recentComments = getCommentsRecent()

	projectsData = await projectsData;
	jamsData = await jamsData;
	recentComments = await recentComments;

	if (!projectsData.success)
		throw error(404, projectsData.error);

	let mostRecentJam = jamsData.jams.sort((a, b) => {
		return b.date_start - a.date_start;
	})[0];
	if (mostRecentJam) {
		let now = Date.now();
		let status = "unknown";
		if (now < mostRecentJam.date_start)
			status = "starting";
		else if (now < mostRecentJam.date_end)
			status = "ongoing";
		else if (!mostRecentJam.judging_finished)
			status = "judging";
		else
			status = "results";
		
		mostRecentJam = {
			id: mostRecentJam.id,
			title: mostRecentJam.title,
			date_start: mostRecentJam.date_start,
			date_end: mostRecentJam.date_end,
			judging_finished: mostRecentJam.judging_finished,
			contestant_count: mostRecentJam.contestant_count,
			submission_count: mostRecentJam.submission_count,
			status: status,
		}
	}

	return {
		projects: projectsData.projects,
		mostRecentJam: mostRecentJam,
		recentComments: recentComments,
	}
};
