
export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getProjectLink(id, name) {
	let encodedName = encodeURIComponent(name.replace(/[^a-zA-Z0-9]+/g," ").replaceAll(" ", "-").toLowerCase());
	return `/projects/${id}/${encodedName}`;
}

export const tags = [
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
		id: "resourcep",
		display: "Resource Pack",
	},
	{
		id: "audio",
		display: "Audio",
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