import { Router, render } from "../js/router.js";
import { APIRequest, formatDate, user, getAvatarUrl } from "../js/helpers.js"

Router.notFound(async () => {
    await render('404')
})

Router.set('/', async () => {
	if (await user() == null)
		return await render('sign')


	const response = await APIRequest.build("/user/leaderboard", "GET").send();
	const users = await response.json();

	await render('home', {
		winners: JSON.stringify(users)
	})

	let userContainer = document.querySelector("#board-user-container");

	users.forEach((e, index) => {
		const el = document.createElement('c-leaduser');
		el.setAttribute("id", index + 1);
		el.setAttribute("name", e.username);
		el.setAttribute("wins", e.wins);

		el.classList.add("list-group-item", "d-flex", "justify-content-between");

		userContainer.appendChild(el);
	});

}).setName('home')

Router.set('/about', async () => {
	await render('about')
})


Router.set('/pong', async () => {
	if (!await user())
		await render('sign')
	else {
		await render('pong')
		await new Promise(resolve => setTimeout(resolve, 10))
		import("../js/pong.js").then(async m => {
			await m.reset()
			m.connect_hub()
		})
	}
})

Router.set('/user/{username}', async (match) => {
	const response = await APIRequest.build(`/user/${match[1]}`, 'GET').send()
	const data = await response.json()

	if (response.status == 404) {
		return render('404')
	}

	await render('profile', {
		avatar: getAvatarUrl(data.avatar),
		username: data.username,
		connected: data.online,
		wins: data.wins,
		games: data.games,
		winrate: data.winrate,
		target_username: match[1],
		target_id: data.id,
	})

	const r = await APIRequest.build(`/user/${match[1]}/games/`, 'GET').send()

	const games = await r.json()
	const section = document.querySelector('#games')

	if (games.length > 0)
	{
		for (const game of games)
		{
			const date = formatDate(new Date(game.created_at), "DD-MM-YYYY")
			let subSection = document.querySelector(`#c${date}`)

			if (subSection == null)
			{
				section.innerHTML += `<h2>${date}</h2><hr />
				<ol class="mb-5 list-group" id="c${date}">
				</ol>`

				subSection = document.querySelector(`#c${date}`)
			}

			if (game.players.length == 2)
			{
				subSection.innerHTML += `<c-quickgame class="list-group-item" at="${game.created_at}" target-user=${JSON.stringify(game.target_user_info)} opponent=${JSON.stringify(game.adversaries[0])}></c-quickgame>`
			}
			else if (game.square)
			{
				subSection.innerHTML += `<c-squaregame class="list-group-item" at="${game.created_at}" main-player=${JSON.stringify(game.target_user_info)} opponent-player=${JSON.stringify(game.adversaries)} ></c-squaregame>`
			}
			else
			{
				let players = []
				let otherScore = 0

				for (const player of game.players)
				{
					if (game.target_user_info.score != player.score)
						otherScore = player.score
					players.push(player.user.username)
				}

				let indexOfPlayer = players.indexOf(game.target_user_info.user.username)
				const indexOfMate = indexOfPlayer % 2 ? indexOfPlayer - 1 : indexOfPlayer + 1

				players.splice(indexOfPlayer, 1)
				players.splice(indexOfMate % 2 ? indexOfMate - 1 : indexOfMate, 1)
				
				subSection.innerHTML += `<c-teamgame class="list-group-item" at="${game.created_at}" has_won="${game.target_user_info.win}" team-1-score="${game.target_user_info.score}" team-2-score="${otherScore}" player-1-username="${game.target_user_info.user.username}" player-2-username="${game.players[indexOfMate].user.username}" player-3-username="${players[0]}" player-4-username="${players[1]}"></c-teamgame>`
			}
		}
	}
	else
	{
		section.innerHTML = `<li class="row d-flex align-items-center">
			<div class="col text-center fs-1">
				Aucune partie jouée encore
			</div>
		</li>`
	}

	document.querySelector("#games-filter").onchange = (e) => {
		const allElement = document.querySelectorAll("c-teamgame, c-quickgame, c-squaregame");
		const setEquiv = {
			"1v1": "c-quickgame",
			"2v2": "c-teamgame",
			"1v3": "c-squaregame",
		}

		if (e.target.value != "all")
		{
			allElement.forEach(el => {
				if (setEquiv[e.target.value] == el.tagName.toLowerCase())
					el.style.display = "block";
				else
					el.style.display = "none";
			});
		}
		else
			allElement.forEach(el => {el.style.display = "block"});

		updateBorders();
	}
	function updateBorders() {
		const items = document.querySelectorAll("c-teamgame, c-quickgame, c-squaregame");
		let visibleItems = [...items].filter(item => item.style.display !== 'none');
		
		// Reset border-radius for all items
		items.forEach(item => {
			item.style.borderTopLeftRadius = '';
			item.style.borderTopRightRadius = '';
			item.style.borderBottomLeftRadius = '';
			item.style.borderBottomRightRadius = '';
			item.style.borderTop = '';
		});

		if (visibleItems.length > 0) {
			visibleItems[0].style.borderTop = `1px solid var(--bs-list-group-border-color)`;
			visibleItems[0].style.borderTopLeftRadius = 'inherit';
			visibleItems[0].style.borderTopRightRadius = 'inherit';
			visibleItems[visibleItems.length - 1].style.borderBottomLeftRadius = 'inherit';
			visibleItems[visibleItems.length - 1].style.borderBottomRightRadius = 'inherit';
		}
	}
})