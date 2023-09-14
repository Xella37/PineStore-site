
import { error } from "@sveltejs/kit";

export async function getProject(id) {
	let raw = await fetch(`https://pinestore.cc/api/project/${id}`);
	let data = await raw.json();

	if (!data.success)
		throw error(404, data.error);

	return data;
}

export async function getProjects(category) {
	let raw;
	if (category?.length > 0) // checking length as well for robustness
		raw = await fetch(`https://pinestore.cc/api/category/${category}`);
	else
		raw = await fetch(`https://pinestore.cc/api/projects`);

	let data = await raw.json();

	if (!data.success)
		throw error(404, data.error);

	return data;
}

export async function searchProjects(query) {
	let raw = await fetch(`https://pinestore.cc/api/search?q=${encodeURIComponent(query)}`);
	let data = await raw.json();

	return data;
}

export async function getUser(id) {
	let raw = await fetch(`https://pinestore.cc/api/user/${id}`);
	let data = await raw.json();

	if (!data.success)
		throw error(404, data.error);

	return data;
}

export async function getUserProjects(id) {
	let raw = await fetch(`https://pinestore.cc/api/userprojects/${id}`);
	let data = await raw.json();

	if (!data.success)
		throw error(404, data.error);

	data.projects = data.projects.sort((a, b) => {
		return Math.max(b.date_added, b.date_updated) - Math.max(a.date_added, a.date_updated);
	});

	return data;
}