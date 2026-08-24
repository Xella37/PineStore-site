
<svelte:head>
	<title>Update project</title>
</svelte:head>

<script>
	import { onMount } from "svelte";
	import { getProject, setProjectInfo } from "$lib/database.js";
	import { getProjectLink, addToast } from "$lib/util.js";

    import CopyField from "$lib/svelte/CopyField.svelte";

	import { page } from "$app/stores";
	$: projectId = $page.params.id;

	import TagList from "$lib/svelte/TagList.svelte";
    import ConfigDescription from "./ConfigDescription.svelte";
    import ConfigMedia from "./ConfigMedia.svelte";
    import ConfigShare from "./ConfigShare.svelte";
    import ConfigChangelog from "./ConfigChangelog.svelte";
    import ConfigCoOwners from "./ConfigCoOwners.svelte";

	let savedProject = {
		description_markdown: "no markdown description",
	};
	let project = {};
	let unsavedChanges = false;

	$: if (project) {
		let changes = false;
		for (const key of Object.keys(project)) {
			let value = project[key];
			let valueSaved = savedProject[key];

			if (typeof value == "object" && value != null) {
				if (value?.length != valueSaved?.length) {
					changes = true;
					break;
				}
				for (const key of Object.keys(value)) {
					if (value[key] != valueSaved[key]) {
						changes = true;
						break;
					}
				}
			} else if (value != valueSaved) {
				changes = true;
				break;
			}
		}
		unsavedChanges = changes;
	}

	async function loadProject() {
		let projectData = await getProject(projectId, "SESSION");
		if (!projectData.success)
			return addToast("Failed!", "Failed to load project. Error: " + (projectData.error ?? "no error"), "error");

		let loadedProject = projectData.project;
		savedProject = loadedProject;
		savedProject.selectedTags = savedProject.tags ?? [];
		savedProject.keywordsString = savedProject.keywords.join(",") ?? [];
		project = {...savedProject};
		
	}

	async function saveProject() {
		let sendData = {...project};
		sendData.tags = project.selectedTags;
		sendData.keywords = project.keywordsString.split(",");

		let saveData = await setProjectInfo(sendData);
		unsavedChanges = false;
		savedProject = {...project};

		if (saveData.success)
			addToast("Saved!", "Your project has successfully been saved.", "success", 3);
		else
			addToast("Failed!", "Failed to save project. Error: " + (saveData.error ?? "no error"), "error");
	}

	async function viewProjectPage() {
		window.open(getProjectLink(project.id, savedProject.name), "_blank");
	}

	$: badgeLink = `https://raster.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpinestore.cc%2Fapi%2Fproject%2F${encodeURIComponent(project?.id)}&query=%24.project.downloads&suffix=%20downloads&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzYuOTA0IiBoZWlnaHQ9Ijg5LjI5NSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc2OS4wNCA4OTIuOTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%2BCiA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNzQgLTQuNjgyNikiIGZpbGw9IiM5YWIyZjIiPgogIDxwYXRoIGQ9Im00MTAgODUxYzAtMTIgMjYtMjEgNTgtMjEgMTUgMCAyMiA0IDE3IDktMTQgMTItNzUgMjItNzUgMTJ6Ii8%2BCiAgPHBhdGggZD0ibTU4NSA3NDJjLTEtNDkgNC03MiAxNi04NSAyMi0yNCAzMC02OCAxNi04Ni0xMi0xNC0yNy0zOS00OC03OC0xMC0xOS05LTI2IDQtNDEgMjItMjQgMjEtNjctMi0xNDQtMjEtNjktMzktMTQ0LTQ4LTE5NS00LTI2LTItMzMgMTEtMzMgMzEgMCAxMTIgMzMgMTQxIDU4IDI4IDIzIDgxIDkyIDcxIDkyLTIgMCA1IDI2IDE2IDU3IDI4IDc5IDI5IDIyNCAzIDMwOC0xMCAzMy0xOSA2Mi0xOSA2NS00IDI2LTEzMiAxNTAtMTU1IDE1MC0zIDAtNi0zMC02LTY4eiIvPgogIDxwYXRoIGQ9Im02OCA2NzNjLTcyLTEwOS03MS0yNzggMy00MjMgMzYtNzEgNjItMTAwIDEyOC0xNDAgNDMtMjcgNjUtMzQgMTE4LTM2IDEwMC00IDk4IDExLTE5IDEzNi0zNCAzNy03OCA4OC05NiAxMTMtMjggMzktMzEgNDgtMjEgNjUgMTEgMTcgNiAyNy0zMyA3OS00MCA1My00NCA2Mi0zMiA3OCAxNyAyMyAxOCA1NyAyIDczLTYgNi0xNCAzMS0xNyA1NC02IDQyLTYgNDItMzMgMXoiLz4KIDwvZz4KIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNC43NCAtNC42ODI2KSIgZmlsbD0iIzU5YTY0ZiI%2BCiAgPHBhdGggZD0ibTM2NSA4MTNjLTUzLTYtMTM5LTMzLTE5Mi02MS02OC0zNS04My02Ny01OC0xMjIgMjYtNTkgNDAtNjcgNzgtNDkgNjggMzMgMTY3IDU4IDI2NiA2OSA1OCA1IDEwNiAxMiAxMDkgMTQgMiAzIDYgMzIgOSA2NSA4IDg1IDAgOTEtMTAxIDkwLTQ0LTEtOTQtNC0xMTEtNnoiLz4KICA8cGF0aCBkPSJtNDEwIDQ1OWMtNjctNy0xNjAtMjktMTk5LTQ4LTI3LTE0LTM0LTM2LTIwLTYzIDIxLTM4IDk3LTEzNiAxNTAtMTkzIDI1LTI3IDU4LTcxIDczLTk3IDI1LTQzIDMxLTQ3IDU0LTQyIDQwIDEwIDQyIDEyIDQyIDUyIDAgMjAgNiA1NyAxNCA4MiAyNCA3MyA1NCAxOTIgNjIgMjM2IDUgMzUgMyA0NS0xNSA2My0yMyAyMy0zNiAyNC0xNjEgMTB6Ii8%2BCiA8L2c%2BCiA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNzQgLTQuNjgyNikiIGZpbGw9IiM3ZWNiMjUiPgogIDxwYXRoIGQ9Im01NTggNjc0Yy0yLTItNTEtOS0xMDktMTQtMTAyLTExLTIwNC0zNy0yNjQtNjktMTYtOC0zMi0xNC0zNC0xMi00IDMtMzEtNDgtMzEtNjEgMC01IDIxLTMxIDQ2LTU4IDUxLTU0IDcxLTYwIDEzMC0zNSAxOSA4IDgzIDE5IDE0MiAyNSA1OCA2IDEwNyAxMiAxMDcgMTNzMTUgMjYgMzMgNTZjMjcgNDMgMzIgNjMgMzAgOTktMiAzNS04IDQ3LTI1IDUzLTExIDQtMjMgNi0yNSAzeiIvPgogPC9nPgogPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0Ljc0IC00LjY4MjYpIiBmaWxsPSIjZWNlZGVmIj4KICA8cGF0aCBkPSJtMjYwIDg5MGMtMzQtOC03MC00MS03MC02NSAwLTYtOS0yMC0yMC0zMHMtMjAtMjItMjAtMjctMTMtMjEtMzAtMzVjLTM1LTI5LTQxLTgzLTEzLTEyMiAxNS0yMiAxNS0yNi0xLTU2LTE4LTMzLTE4LTMzIDI3LTkxIDI4LTM2IDQyLTYzIDM2LTY4LTIzLTI1IDktNzggMTIwLTE5NyAzNi0zOCA3Mi04MSA4Mi05NiAxMC0xNCAyNS0zMCAzMy0zNSAzNi0yMCA3IDMyLTUzIDk3LTQ4IDUxLTEyNiAxNTAtMTQ5IDE4OS0xMCAxOC05IDI0IDEwIDQwIDIzIDE5IDIzIDE5LTI5IDcxLTUzIDUyLTUzIDUyLTM4IDgyIDE0IDI4IDE0IDMzLTEwIDc2LTMyIDU3LTIzIDgxIDQ2IDEyMCAzNCAxOSA0OSAzMyA0NSA0Mi0xNCAzNyAzNiA3NSA5OCA3NSAyNSAwIDQwLTcgNTQtMjUgMTgtMjMgMjctMjUgOTUtMjUgOTQgMCAxMDItOCA5My04OS02LTUzLTUtNTkgMTQtNjQgMzItOCAyNi02NC0xNS0xMzItMzUtNTgtMzUtNTgtOS04MiAyMS0xOSAyNC0yOSAxOS01Ni0xMC00Ny00NC0xNzUtNjEtMjI3LTgtMjUtMTQtNjItMTQtODMgMC0yNy01LTM5LTE3LTQzLTEwLTMtMjUtOC0zMy0xMC0xMi00LTEyLTYtMS0xNCAyNy0xNiA1NiA1IDY5IDUxIDM1IDExNyA0MyAxNDggNDYgMTcwIDIgMTMgMTEgNTEgMjEgODQgMjEgNzEgMjEgMTIxIDAgMTQ1LTE0IDE1LTEzIDE5IDUgNDMgMTEgMTQgMjAgMzAgMjAgMzVzNyAxNSAxNSAyMmMyMSAxNyAxNiA3NS0xMCAxMDItMTggMTktMjAgMzItMTcgNzkgNCA1MCAyIDU4LTE5IDcyLTEyIDktNTAgMTktODMgMjMtNDUgNS02NSAxMy04MyAzMi0yNiAyOC05MiAzOC0xNTMgMjJ6Ii8%2BCiA8L2c%2BCiA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNzQgLTQuNjgyNikiIGZpbGw9IiM3ZTY3NGQiPgogIDxwYXRoIGQ9Im0yNDggODU0Yy0zMC0xNi00Ny01OS0zMC03NiA4LTggMjMtNyA1NCAyIDI0IDcgNjEgMTQgODMgMTcgNTQgNyA1OSAxNSAzNSA0Ni0xOCAyMy0yOSAyNy02OCAyNy0yNi0xLTU5LTctNzQtMTZ6Ii8%2BCiA8L2c%2BCjwvc3ZnPgo%3D&label=PineStore`
	$: badgeLinkMarkdown = `[![Download on PineStore](${badgeLink})](${"https://pinestore.cc" + getProjectLink(project.id, savedProject.name ?? "untitled")})`;
	
	onMount(loadProject);
</script>

<div id="backgroundContainer"></div>

<div class="page-container">
	{#if unsavedChanges}
		<div class="unsaved-changes">
			<div class="info-block warning">
				<i class="fa-solid fa-triangle-exclamation"></i>
				You have unsaved changes!
			</div>
		</div>
	{/if}
	<div class="columns">
		<div class="column island island-main">
			<div class="menu-buttons">
				<button on:click={() => { viewProjectPage(); }} id="viewProjectPage" class="button">
					<i class="fa-solid fa-arrow-up-right-from-square"></i>
					View page
				</button>
				<button on:click={() => { saveProject(); }} id="saveProject" class="button">
					<i class="fa-solid fa-floppy-disk"></i>
					Save project
				</button>
			</div>
			<h1>Edit: {project.name}</h1>

			<!-- Project name, co-owners and visibility -->
			<div class="ruler-text">
				<span>main</span>
			</div>

			<div class="form-list">
				<div class="cols">
					<div class="col">
						<div class="form-list">	
							<label for="nameInput">Project name</label>
							<input id="nameInput" type="text" bind:value={project.name} maxlength="40" placeholder="My Cool Project">
						</div>
					</div>
					<div class="col">
						<div class="form-list">	
							<label for="visibleInput">Public (publishes project)</label>
							<button id="visibleInput" class="toggle" style="font-size: 1.75rem;" class:enabled={project.visible} on:click|preventDefault={() => { project.visible = !project.visible; }} />
						</div>
					</div>
				</div>

				<ConfigCoOwners bind:project />
			</div>

			<!-- Description -->
			<div class="ruler-text">
				<span>description</span>
			</div>

			<ConfigDescription bind:project />
			
			<!-- Sharing the program -->
			<div class="ruler-text">
				<span>share your stuff</span>
			</div>

			<ConfigShare bind:project />
					
			<!-- Tags -->
			<div class="ruler-text">
				tags (preferrably 2-3)
			</div>

			<TagList hideSaved bind:selectedTags={project.selectedTags} />

			<!-- Changelogs -->
			<div class="ruler-text">
				changelogs and updates
			</div>
			
			<ConfigChangelog bind:project />
		</div>
		<div class="column">
			<div class="island island-media">
				<!-- Thumbnail and media -->
				<ConfigMedia bind:project />
			</div>

			<div class="island island-badge">
				<!-- Dynamic badge info -->
				<h2>Dynamic badge</h2>
				<div class="form-list">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Preview</label>
					<img src="{badgeLink}" alt="badge">

					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Markdown</label>
					<CopyField text={badgeLinkMarkdown} />

					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Image url</label>
					<CopyField text={badgeLink} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		--island-spacing: 4rem;
		--island-padding: 2rem;
	}

	.menu-buttons {
		float: right;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
		justify-content: end;
		width: max-content;
	}
	@media screen and (max-width: 40rem) {
		.menu-buttons {
			width: 100%;
		}
		.menu-buttons > * {
			width: 100%;
		}
	}

	.columns {
		position: relative;
		display: flex;
		flex-direction: row;
		gap: var(--island-spacing);
		padding: var(--island-spacing);
		align-items: flex-start;
	}
	.column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--island-spacing);
	}

	@media (max-width: 1270px) {
		.columns {
			flex-direction: column;
		}
		.column {
			width: 100%;
			box-sizing: border-box;
		}
	}

	.island-main {
		flex: 2;
		display: block;
	}

	@media (max-width: 800px) {
		.page-container {
			--island-spacing: 2rem;
		}
	}
	@media (max-width: 450px) {
		.page-container {
			--island-spacing: 1rem;
			--island-padding: 1rem;
		}
	}

	.unsaved-changes {
		position: sticky;
		z-index: 100;
		top: 0;
	}
	.unsaved-changes .info-block {
		position: absolute;
		max-width: max-content;
		left: 50%;
		transform: translateX(-50%);
	}
	@media (max-width: 1040px) {
		.unsaved-changes .info-block {
			transform: translate(-50%, -1rem);
		}
	}

	.col {
		min-width: 13rem;
	}
</style>