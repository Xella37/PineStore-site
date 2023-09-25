
export const prerender = true;
export const ssr = true;

export async function load({ params }) {
	let pageId = params.id;

	const pages = [
		{
			id: "",
			title: "Overview",
			body: `This is an overview of the store documentation.

<h3>Possible use cases include (but are not limited to)</h3>
<ul>
	<li>ComputerCraft front-end possibly for embedding in an OS</li>
	<li>Application for managing your projects using a token</li>
	<li>Automatically updating project page through CLI using a token</li>
	<li>Discord bot (better view, search or upload of projects)</li>
	<li>Another bot for a different platform</li>
	<li>Website (same as Discord bot)</li>
	<li>Arcade in CC</li>
	<li>Anything you think is fun or useful :)</li>
</ul>

<h3>A little more info</h3>
Each endpoint returns a JSON object and POST endpoints also require the body to be formatted as JSON. If you are building a CC front-end application, you must use the <a href="/documentation/newdownload">POST /api/newdownload</a> endpoint to report to the server when a project has been installed using the install command.

</p><p>
The returned JSON object always has a "success" value with an "error" value as a string as well if an error occured.`,
		},
		{
			id: "project",
			path: "/api/project/:id",
			type: "GET",
			url_params: [
				{
					name: "id",
					description: "id of the project",
				},
			],
			body: `View all information of a project. Timestamps (date_added, date_updated, date_release) are UNIX timestamps in milliseconds. The target_file is the file after installation that should be run to run the project. Most fields can be null, because it is not yet complete or because it is a library or other type of project that cannot be installed etc. The description has three variants, all of which are optional. Try to use which is best in your use case and try to use the others as fallbacks (e.g. description_short with a truncated version of the default description as fallback). Keywords and screenshot_links are both a list of items seperated by a comma, which may sometimes be trailed by a space. Download_recent shows the number of downloads in the last 30 days.`,
			example_return: `{
	"success": true,
	"project": {
		"id": 4,
		"date_added": 1692013883788,
		"date_updated": 0,
		"date_release": 0,
		"date_publish": 1692013883788,
		"owner_discord": "302427405023313920",
		"owner_name": "Xella",
		"name": "CCDoom",
		"install_command": "pastebin run xLC8mABU",
		"target_file": "Doom.lua",
		"tags": "fun,action",
		"repository": null,
		"version": 0,
		"description_short": null,
		"description": "CCDoom is a 3d first-person shooter ... truncated for example",
		"description_markdown": "CCDoom is a 3d first-person shooter ... truncated for example",
		"has_thumbnail": 1,
		"media_count": 4,
		"keywords": null,
		"downloads": 3,
		"downloads_recent": 0,
		"views": 5,
		"visible": 1
	}
}`,
		},
		{
			id: "projects",
			path: "/api/projects",
			type: "GET",
			body: `For information on the structure of a project, see <a href="/documentation/project">GET /api/project/:id</a>. Returns a full list of all projects.`,
			example_return: `{
	"success": true,
	"projects:": [
		...,
		{
			"id": 4,
			"date_added": 1692013883788,
			"date_updated": 0,
			"date_release": 0,
			"date_publish": 1692013883788,
			"owner_discord": "302427405023313920",
			"owner_name": "Xella",
			"name": "CCDoom",
			"install_command": "pastebin run xLC8mABU",
			"target_file": "Doom.lua",
			"tags": "fun,action",
			"repository": null,
			"version": 0,
			"description_short": null,
			"description": "CCDoom is a 3d first-person shooter ... truncated for example",
			"description_markdown": "CCDoom is a 3d first-person shooter ... truncated for example",
			"has_thumbnail": 1,
			"media_count": 4,
			"keywords": null,
			"downloads": 3,
			"downloads_recent": 0,
			"views": 5,
			"visible": 1
		},
		...
	]
}`,
		},
		{
			id: "search",
			path: "/api/search",
			type: "GET",
			get_params: [
				{
					name: "q",
					description: "a query for search (any string)",
				},
			],
			body: `For information on the structure of a project, see <a href="/documentation/project">GET /api/project/:id</a>. Returns results as a list of all projects that were found using the given search query. All results are in order of best match to worst match. Matches are found using the project creator's name, project name, keywords and description (with short version as fallback). Currently the search uses stemming of keywords and a balance of all attributes to reach a score for a result, but this may become more sophisticated in the future (with e.g. word similarity and word frequency).`,
			example_return: `{
	"success": true,
	"projects:": [
		...,
		{
			"id": 4,
			"date_added": 1692013883788,
			"date_updated": 0,
			"date_release": 0,
			"date_publish": 1692013883788,
			"owner_discord": "302427405023313920",
			"owner_name": "Xella",
			"name": "CCDoom",
			"install_command": "pastebin run xLC8mABU",
			"target_file": "Doom.lua",
			"tags": "fun,action",
			"repository": null,
			"version": 0,
			"description_short": null,
			"description": "CCDoom is a 3d first-person shooter ... truncated for example",
			"description_markdown": "CCDoom is a 3d first-person shooter ... truncated for example",
			"has_thumbnail": 1,
			"media_count": 4,
			"keywords": null,
			"downloads": 3,
			"downloads_recent": 0,
			"views": 5,
			"visible": 1
		},
		...
	]
}`,
		},
		{
			id: "user",
			path: "/api/user/:id",
			type: "GET",
			url_params: [
				{
					name: "id",
					description: "id of the user",
				},
			],
			body: `Get all info for a specific user.`,
			example_return: `{
	"success": true,
	"user": {
		"discord_id": "302427405023313920",
		"joined_on": 1694204887165,
		"name": "Xella",
		"about": "Hey, I'm Xella! I've created this site to more easily have people share and distribute their CC projects! I'm also the creator of Pine3D and a few of the games with 3d graphics made using it :3",
		"about_markdown": null
	}
}`,
		},
		{
			id: "userprojects",
			path: "/api/userprojects/:id",
			type: "GET",
			url_params: [
				{
					name: "id",
					description: "id of the user",
				},
			],
			body: `Get all projects uploaded by a specific user.`,
			example_return: `{
	"success": true,
	"projects:": [
		...,
		{
			"id": 4,
			"date_added": 1692013883788,
			"date_updated": 0,
			"date_release": 0,
			"date_publish": 1692013883788,
			"owner_discord": "302427405023313920",
			"owner_name": "Xella",
			"name": "CCDoom",
			"install_command": "pastebin run xLC8mABU",
			"target_file": "Doom.lua",
			"tags": "fun,action",
			"repository": null,
			"version": 0,
			"description_short": null,
			"description": "CCDoom is a 3d first-person shooter ... truncated for example",
			"description_markdown": "CCDoom is a 3d first-person shooter ... truncated for example",
			"has_thumbnail": 1,
			"media_count": 4,
			"keywords": null,
			"downloads": 3,
			"downloads_recent": 0,
			"views": 5,
			"visible": 1
		},
		...
	]
}`,
		},
		{
			id: "newdownload",
			path: "/api/newdownload",
			type: "POST",
			post_params: [
				{
					name: "projectId",
					description: "id of the project for which to register a new download",
				},
			],
			body: `If you are building a CC front-end application, you must use this endpoint to report to the server when a project has been installed using the install command. This increases the download and downloads_recent count for the given project.`,
			example_return: `{
	"success": true
}`,
		},
		{
			id: "authorization",
			title: "Authorization",
			body: `Using your personal token, which you can get using the /newtoken command with the Discord bot, you can manage your projects with a few API endpoints. Each of these endpoints require authentication using this token using the "Authentication" HTTP header with the value set to your personal token.`,
		},
		{
			id: "auth-profile",
			path: "/api/auth/profile",
			type: "GET",
			body: `Get all user info corresponding to the authentication token.`,
			example_return: `{
	"success": true,
	"user": {
		"discord_id": "302427405023313920",
		"joined_on": 1694204887165,
		"name": "Xella",
		"about": "Hey, I'm Xella! I've created this site to more easily have people share and distribute their CC projects! I'm also the creator of Pine3D and a few of the games with 3d graphics made using it :3",
		"about_markdown": null
	}
}`,
		},
		{
			id: "auth-update-p",
			path: "/api/auth/update-p",
			type: "POST",
			post_params: [
				{
					name: "projectId",
					description: "id of the project for which to update properties",
				},
				{
					name: "allow_null",
					description: "if true, overwrites all values even if some are set to null (each parameter is no longer optional, useful when having to remove data)",
					optional: true,
				},
				{
					name: "projectname",
					description: "the name of the project (max 40)",
					optional: true,
				},
				{
					name: "description_short",
					description: "short version of the description (for use in embeds or short versions for in CC) (max 200)",
					optional: true,
				},
				{
					name: "description",
					description: "full version of the description in plaintext (max 3000)",
					optional: true,
				},
				{
					name: "description_markdown",
					description: "markdown version of the description (max 3500)",
					optional: true,
				},
				{
					name: "install_command",
					description: "CC command to install the project (max 150)",
					optional: true,
				},
				{
					name: "target_file",
					description: "the file that should be run after installation has finished (max 30)",
					optional: true,
				},
				{
					name: "tags",
					description: "comma separated list of tags. Allowed tags: fun,library,utility,turtle,pocket,mod,resourcep,audio,os,emulator,puzzle,action,quirky",
					optional: true,
				},
				{
					name: "repository",
					description: "url for the git repository (max 150)",
					optional: true,
				},
				{
					name: "keywords",
					description: "comma separated list of keywords (max 300)",
					optional: true,
				},
				{
					name: "visible",
					description: "true / false",
					optional: true,
				},
				{
					name: "date_release",
					description: "number, timestamp in ms for countdown timer",
					optional: true,
				},
			],
			body: `Using your personal token, you can update existing project info using this endpoint. The projectId must be specified. All other parameters are optional. Any unspecified property is left unchanged.`,
			example_return: `{
	"success": true
}`,
		},
		{
			id: "auth-thumbnail",
			path: "/api/auth/thumbnail",
			type: "POST",
			body: `Set the project thumbnail.`,
			post_params: [
				{
					name: "projectId",
					description: "id of the project for which to update the thumbnail",
				},
				{
					name: "imageData",
					description: "the image data of the image (either raw, or base64 encoded)",
				},
			],
			example_return: `{
	"success": true
}`,
		},
		{
			id: "auth-media",
			path: "/api/auth/media",
			type: "POST",
			body: `Add an image to the project media.`,
			post_params: [
				{
					name: "projectId",
					description: "id of the project for which to update the thumbnail",
				},
				{
					name: "imageData",
					description: "the image data of the image (either raw, or base64 encoded)",
				},
			],
			example_return: `{
	"success": true
}`,
		},
		{
			id: "auth-removemedia",
			path: "/api/auth/removemedia",
			type: "POST",
			body: `Remove an image from the project media by index. Each image index larger than the given index is then decreased by one.`,
			post_params: [
				{
					name: "projectId",
					description: "id of the project for which to update the thumbnail",
				},
				{
					name: "index",
					description: "the index of the media to remove",
				},
			],
			example_return: `{
	"success": true
}`,
		},
		{
			id: "auth-update-acc",
			path: "/api/auth/update-acc",
			type: "POST",
			post_params: [
				{
					name: "allow_null",
					description: "if true, overwrites all values even if some are set to null (each parameter is no longer optional, useful when having to remove data)",
					optional: true,
				},
				{
					name: "name (max 40)",
					description: "your name as it should be displayed",
					optional: true,
				},
				{
					name: "about",
					description: "profile about in plaintext (max 1500)",
					optional: true,
				},
				{
					name: "about_markdown",
					description: "markdown version of the about info (max 1500)",
					optional: true,
				},
			],
			body: `Using your personal token, you can update your account info. All parameters are optional. Any unspecified property is left unchanged.`,
			example_return: `{
	"success": true
}`,
		},
		{
			id: "auth-newproject",
			path: "/api/auth/newproject",
			type: "POST",
			post_params: [
				{
					name: "name",
					description: "the name of the new project",
				},
			],
			example_return: `{
	"success": true,
	"projectId": 10
}`,
		},
		{
			id: "auth-delete",
			path: "/api/auth/delete",
			type: "POST",
			post_params: [
				{
					name: "projectId",
					description: "the id of the project to delete",
				},
			],
			example_return: `{
	"success": true
}`,
		},
	];
	
	let thisPage;
	for (const p of pages) {
		if (p.id == pageId) {
			thisPage = p;
			break;
		}
	}

	return {
		pages: pages,
		thisPage: thisPage,
	};
};
