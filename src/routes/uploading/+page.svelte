
<svelte:head>
	<title>Uploading - PineStore</title>
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="pinestore.cc" />
	<meta property="og:title" content="Uploading - PineStore" />
	<meta property="og:description" content="Easily upload your ComputerCraft projects to PineStore!" />
	<meta name="description" content="Easily upload your ComputerCraft projects to PineStore!" />
	<meta name="twitter:description" content="Easily upload your ComputerCraft projects to PineStore!" />
	<meta property="og:url" content="https://pinestore.cc/uploading" />
	<meta property="og:image" content="/pinestore_cropped.png" />
	<meta name="keywords" content="uploading, projects, uploading projects, computercraft, computer, craft, lua, minecraft, mine, programming, library, games, programs, collection, store">
</svelte:head>

<div id="backgroundContainer"></div>

<div class="page-container">
	<div class="page page-thin shadow">
		<h1>Uploading your project</h1>
		<div class="flex-list">
			<div class="option">
				<i class="fa-brands fa-discord"></i>
				<span>You can upload projects on Discord using bot commands. <a href="https://discord.com/oauth2/authorize?client_id=1073728324142116948&scope=bot&permissions=277025475584">Invite the bot</a> or use it in the <a href="https://discord.gg/MjsNjK2psB">Lua3D Discord server</a>.</span>
			</div>
			<div class="option">
				<i class="fa-solid fa-book"></i>
				<span>You also have the option to use the <a href="/documentation">API</a> to upload and update your projects!</span>
			</div>
		</div>
		<h2>How it works</h2>
		<p>This website is a frontend for the store database / API. Anyone can create their own website, CC program, bot other other tools to look at any of the data from the store using <a href="/documentation">the API documentation</a>.</p>
		<p>Uploading your project is currently mainly done through the Discord bot which can be invited with the <a href="https://discord.com/oauth2/authorize?client_id=1073728324142116948&scope=bot&permissions=277025475584">Discord bot invite link</a>. Alternatively, the bot is already added to the <a href="https://discord.gg/MjsNjK2psB">Lua3D Discord</a> where you can also use its commands. Of course, you can create your own programs to manage your projects and upload (automatically) to the store using the API!</p>
	</div>
</div>

<style>
	.flex-list {
		justify-content: space-around;
		padding-top: 2rem;
		padding-bottom: 2rem;
	}
	.option {
		max-width: 20rem;
		text-align: center;
		color: var(--text-color-medium);
	}
	.option i {
		font-size: 3rem;
		display: block;
		margin-bottom: 1.5rem;
		color: var(--text-color-dark);
	}
</style>