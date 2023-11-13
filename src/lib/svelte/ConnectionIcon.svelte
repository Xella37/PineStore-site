
<script>
	export let id = "link";

	export function getConnectionIcon(id) {
		if (id == "link") return `fa-solid fa-link`;
		else if (id == "github") return `fa-brands fa-github`;
		else if (id == "discord") return `fa-brands fa-discord`;
		else if (id == "twitterx") return `fa-brands fa-twitter`;
		else if (id == "youtube") return `fa-brands fa-youtube`;
		else if (id == "twitch") return `fa-brands fa-twitch`;
		else if (id == "reddit") return `fa-brands fa-reddit`;
		else if (id == "steam") return `fa-brands fa-steam`;
		return `fa-solid fa-link`;
	}

	$: iconClass = getConnectionIcon(id);
</script>

<i class="{iconClass}"></i>
