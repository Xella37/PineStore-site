import { error } from "@sveltejs/kit";
import { getJams } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = await getJams(params.id);

	// console.log(jamData);

	if (!jamData.success)
		throw error(404, jamData.error);

	return {
		jams: jamData.jams,
	};
};
