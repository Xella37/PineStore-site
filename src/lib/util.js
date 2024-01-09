
import { writable, get } from "svelte/store";

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getProjectLink(id, name) {
	let encodedName = encodeURIComponent(name.replace(/[^a-zA-Z0-9]+/g," ").replaceAll(" ", "-").toLowerCase());
	return `/projects/${id}/${encodedName}`;
}

let nextToastId = 0;
export let toasts = writable([]);
/**
 * Add a new toast notification
 * @param {string} title
 * @param {string} body
 * @param {"success" | "info" | "error" | "warning"} icon
 * @param {number?} duration in seconds
 */
export function addToast(title, body, icon, duration) {
	toasts.set([
		...get(toasts),
		{
			id: nextToastId++,
			title: title ?? "Untitled",
			body: body ?? "Empty",
			timestamp: Date.now(),
			icon: icon,
			duration: duration * 1000,
			durationProgress: 0,
		}
	]);
}

export function calcTimeAgo(timestamp, fullLength=false) {
	let s = Math.floor((Date.now() - timestamp) / 1000);
	if (s < 60) {
		if (fullLength)
			return `${s} ${s == 1 ? "second" : "seconds"}`;
		else
			return `${s}s`;
	}
	if (s < 60 * 60) {
		let m = Math.floor(s/60);
		if (fullLength)
			return `${m} ${m == 1 ? "minute" : "minutes"}`;
		else
			return `${m}m`;
	}
	if (s < 60 * 60 * 24) {
		let h = Math.floor(s/60/60);
		if (fullLength)
			return `${h} ${h == 1 ? "hour" : "hours"}`;
		else
			return `${h}h`;
	}

	let d = Math.floor(s/60/60/24);
	if (d <= 31) {
		if (fullLength)
			return `${d} ${d == 1 ? "day" : "days"}`;
		else
			return `${d}d`;
	}
	if (d <= 365) {
		let m = Math.floor(d / 30);
		if (fullLength)
			return `${m} ${m == 1 ? "month" : "months"}`;
		else
			return `${m}mo`;
	}

	let y = Math.floor(d / 365);
	if (fullLength)
		return `${y} ${y == 1 ? "year" : "years"}`;
	else
		return `${y}y`;
}

const allTags = [
	{
		id: "saved",
		display: "Saved",
	},
	{
		id: "fun",
		display: "Fun",
	},
	{
		id: "library",
		display: "Library",
	},
	{
		id: "utility",
		display: "Utility",
	},
	{
		id: "turtle",
		display: "Turtle",
	},
	{
		id: "pocket",
		display: "Pocket",
	},
	{
		id: "mod",
		display: "Mod",
	},
	{
		id: "audio",
		display: "Audio",
	},
	{
		id: "resourcep",
		display: "Resource Pack",
	},
	{
		id: "os",
		display: "Operating System",
	},
	{
		id: "emulator",
		display: "Emulator",
	},
	{
		id: "puzzle",
		display: "Puzzle",
	},
	{
		id: "action",
		display: "Action",
	},
	{
		id: "quirky",
		display: "Quirky"
	},
];
export const tags = allTags;

let tagDisplayMapping = {};
for (const tag of allTags) {
	tagDisplayMapping[tag.id] = tag.display;
}
export const tagToDisplay = tagDisplayMapping;