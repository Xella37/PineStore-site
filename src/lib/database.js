/**
 * Interact with the PineStore API
 * @param {"GET" | "POST"} method 
 * @param {string} path 
 * @param {object?} body for POST request
 * @returns 
 */
async function api(method, path, body) {
	let requestInit = {
		"headers": {}
	}
	if (path.startsWith("auth/")) {
		let session = getCookie("session");
		if (session == null) return;
		requestInit["headers"]["authorization"] = session;
	}
	if (method == "POST") {
		requestInit["method"] = "POST";
		requestInit["body"] = JSON.stringify(body);
		requestInit["headers"]["Content-Type"] = "application/json";
	}

	const raw = await fetch("https://pinestore.cc/api/" + path, requestInit);
	const data = await raw.json();

	return data;
}

function getCookie(cookieId) {
	const cookieValue = document.cookie
		.split("; ")
		.find((row) => row.startsWith(cookieId + "="))
		?.split("=")[1];
	return cookieValue;
}

function removeEmptyStrings(data) {
	for (const key in data)
		if (typeof data[key] == "string" && !(data[key]?.length > 0))
			data[key] = null;
	return data;
}

export const getProject = (id) => api("GET", "project/" + id);
export const getProjects = () => api("GET", "projects");
export const searchProjects = (query) => api("GET", "https://pinestore.cc/api/search?q=" + encodeURIComponent(query));

export const getComments = (projectId) => api("GET", "comments/" + projectId);

export const getUser = (id) => api("GET", "user/" + id);
export const getUserProjects = (id) => api("GET", "userprojects/" + id);
export const authDiscord = (code) => api("GET", "discordauth/" + code);

export const getMyProfile = () => api("GET", "auth/profile");
export const setProfileInfo = (profileData) => api("POST", "auth/update-acc", removeEmptyStrings({
	"allow_null": true,
	"name": profileData.name,
	"about": profileData.about,
	"about_markdown": profileData.about_markdown,
}));

export const setProjectInfo = (projectData) => api("POST", "auth/update-p", removeEmptyStrings({
	allow_null: true,
	projectId: projectData.id,
	...projectData,
}));

export const setProjectThumbnail = (projectId, imageData) => api("POST", "auth/thumbnail", { projectId, imageData });
export const addProjectMedia = (projectId, imageData) => api("POST", "auth/media", { projectId, imageData });
export const removeProjectMedia = (projectId, index) => api("POST", "auth/removemedia", { projectId, index });

export const newProject = (name) => api("POST", "auth/newproject", { name });
export const deleteProject = (id) => api("POST", "auth/delete", { projectId: id });

export const getMyProjects = () => api("GET", "auth/projects");

export const newComment = (projectId, replyId, text) => api("POST", "auth/comment", { projectId, replyId, text });

export const getNotifications = () => api("GET", "auth/notifications");
export const hasUnreadNotifications = () => api("GET", "auth/newnotifications");

export const getUserOptions = () => api("GET", "auth/options");
export const setUserOptions = (options) => api("POST", "auth/options", {
	discord_notifications: options.discord_notifications,
});

export const reportProjectView = (id) => api("POST", "newview", { projectId: id });
export const reportProjectDownload = (id) => api("POST", "newdownload", { projectId: id });

export async function isLoggedIn() {
	console.log("Checking login");
	let profileData = await getMyProfile();
	return profileData?.user?.discord_id != null;
}

export function logoutUser() {
	document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.href = "/";
}