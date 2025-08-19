import { error } from "@sveltejs/kit";
import { getJam } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params, cookies }) {
	let jamData = getJam(params.id);
	jamData = await jamData;

	if (!jamData.success)
		throw error(404, jamData.error);

	return {
		jam: jamData.jam,
	};
};
