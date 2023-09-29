
<svelte:head>
	<title>FAQ - PineStore</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="FAQ - PineStore" />
	<meta property="og:description" content="Frequently Asked Questions related to PineStore, its API and other questions." />
	<meta name="description" content="Frequently Asked Questions related to PineStore, its API and other questions." />
	<meta name="twitter:description" content="Frequently Asked Questions related to PineStore, its API and other questions." />
	<meta property="og:url" content="https://pinestore.cc/faq" />
	<meta property="og:image" content="/pinestore_cropped.png" />
	<meta name="keywords" content="faq, frequently, asked, questions, frequently asked questions, projects, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>Frequently Asked Questions</h1>

		<h2>How do I add my project?</h2>
		<p>You can add your project by logging into the website with your Discord account and going to your profile. Alternatively, you can use the API to manage your projects, or use the commands of <a href="https://discord.com/oauth2/authorize?client_id=1073728324142116948&scope=bot&permissions=277025475584">the Discord bot</a>.</p>

		<h2>What's the API for?</h2>
		<p>You can use <a href="/documentation">the API documentation</a> to make anything you think can be fun or useful :)</p>
		<p>Some examples include: a Discord/Telegram/other bot, a ComputerCraft client to install programs, automatically updating your project or account info or anything else!</p>

		<h2>What projects are allowed?</h2>
		<p>Anything related to ComputerCraft! This includes programs, libraries, resource packs, emulators, mods/addons!</p>

		<h2>How does it work?</h2>
		<p>This website is a frontend for the store database / API, and uses the same API endpoints you can use in your projects. Anyone can create their own website, CC program, bot other other tools to look at any of the data from the store using <a href="/documentation">the API documentation</a>.</p>

		<h2>Can I help?</h2>
		<p>Definitely! This website is <a href="https://github.com/Xella37/PineStore-site">open source</a> and anyone can contribute! Feel free to message me (Xella) on Discord if you want to help out.</p>
		<p>You can also help out by creating a ComputerCraft frontend to install programs easily. We've had a very basic one which is on <a href="https://pastebin.com/yhYuX1fw">pastebin</a>, but it has not been updated to work with the changes made to the store, and its code is rather messy, so it should probably be written from scratch.</p>
	</div>
</div>

<style>
	h2 {
		margin-top: 3rem;
	}

	p {
		margin-left: 1rem;
	}
</style>