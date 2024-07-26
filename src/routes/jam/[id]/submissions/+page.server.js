import { error } from "@sveltejs/kit";
import { getJam, getJamSubmissions } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = getJam(params.id);
	let submissionsData = getJamSubmissions(params.id);

	jamData = await jamData;
	submissionsData = await submissionsData;

	if (!jamData.success)
		throw error(404, jamData.error);
	if (!submissionsData.success)
		throw error(404, submissionsData.error);

	let jam = jamData.jam;
	let submissions = submissionsData.submissions;

	if (jam.judging_finished) {
		submissions = submissions.sort((a, b) => {
			let finalA = a.JamContestant.scores["Final"];
			let finalB = b.JamContestant.scores["Final"];
			return finalB - finalA;
		});

		let lastScore = 0;
		let lastScorePos = 0;
		for (let i = 0; i < submissions.length; i++) {
			let sub = submissions[i];
			let score = sub.JamContestant.scores["Final"];
			if (score == lastScore) {
				if (lastScorePos == 0)
					sub.medal = "gold";
				if (lastScorePos == 1)
					sub.medal = "silver";
				if (lastScorePos == 2)
					sub.medal = "bronze";
			} else {
				if (i == 0)
					sub.medal = "gold";
				if (i == 1)
					sub.medal = "silver";
				if (i == 2)
					sub.medal = "bronze";
				lastScorePos = i;
			}
			lastScore = score;
		}
	}

	return {
		jam: jam,
		submissions: submissions,
	};
};
