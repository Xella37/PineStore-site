
import { error } from "@sveltejs/kit";

function getCookie(cookieId) {
	const cookieValue = document.cookie
		.split("; ")
		.find((row) => row.startsWith(cookieId + "="))
		?.split("=")[1];
	return cookieValue;
}

export async function getProject(id) {
	let raw = await fetch(`https://pinestore.cc/api/project/${id}`);
	let data = await raw.json();

	if (!data.success)
		throw error(404, data.error);

	return data;
}

export async function getProjects() {
	let raw = await fetch(`https://pinestore.cc/api/projects`);
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

export async function authDiscord(code) {
	let raw = await fetch(`https://pinestore.cc/api/discordauth/${code}`);
	let data = await raw.json();
	return data;
}

export async function myProfile() {
	let session = getCookie("session");
	if (session == null) return;
	let raw = await fetch(`https://pinestore.cc/api/auth/profile`, {
		headers: {
			authorization: session,
		},
	});
	let data = await raw.json();
	return data;
}

export async function setProfileInfo(profileData) {
	for (const key in profileData) {
		if (typeof profileData[key] == "string" && !profileData[key]?.length > 0)
			profileData[key] = null;
	}

	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/update-acc`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			allow_null: true,
			name: profileData.name,
			about: profileData.about,
			about_markdown: profileData.about_markdown,
		}),
	});
	let data = await raw.json();
	return data;
}

export async function setProjectInfo(projectData) {
	for (const key in projectData) {
		if (typeof projectData[key] == "string" && !projectData[key]?.length > 0)
			projectData[key] = null;
	}

	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/update-p`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({allow_null: true, projectId: projectData.id, ...projectData}),
	});
	let data = await raw.json();
	return data;
}
export async function setProjectThumbnail(projectId, imageData) {
	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/thumbnail`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({projectId: projectId, imageData: imageData}),
	});
	let data = await raw.json();
	console.log(data);
	return data;
}
export async function addProjectMedia(projectId, imageData) {
	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/media`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({projectId: projectId, imageData: imageData}),
	});
	let data = await raw.json();
	console.log(data);
	return data;
}
export async function removeProjectMedia(projectId, index) {
	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/removemedia`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({projectId: projectId, index: index}),
	});
	let data = await raw.json();
	console.log(data);
	return data;
}

export async function newProject(name) {
	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/newproject`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			name: name,
		}),
	});
	let data = await raw.json();
	return data;
}

export async function deleteProject(id) {
	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/delete`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			projectId: id,
		}),
	});
	let data = await raw.json();
	return data;
}

export async function getMyProjects() {
	let session = getCookie("session");
	let raw = await fetch(`https://pinestore.cc/api/auth/projects`, {
		headers: {
			authorization: session,
			"Content-Type": "application/json",
		},
	});

	let data = await raw.json();

	if (!data.success)
		throw error(404, data.error);

	return data;
}

export async function isLoggedIn() {
	console.log("Checking login");
	let profileData = await myProfile();
	return profileData.user?.discord_id != null;
}

export function logoutUser() {
	document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.href = "/";
}