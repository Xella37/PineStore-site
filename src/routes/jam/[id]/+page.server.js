import { error } from "@sveltejs/kit";
import { getJam, getUser } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = await getJam(params.id);

	if (!jamData.success)
		throw error(404, jamData.error);

	let judges = [];
	for (let judge of jamData.jam.judges) {
		let judgeRes = getUser(judge);
		judges.push(judgeRes);
	}
	judges = await Promise.all(judges);
	judges = judges.map(judge => judge.user).filter(judge => judge != null);

	return {
		jam: jamData.jam,
		judges: judges
	};
};
