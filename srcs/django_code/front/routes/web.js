import { Router, render } from "../js/router.js";
import { api, user, user_token } from "../js/helpers.js"

Router.set('/', async () => {
	if (await user() == null)
		render('sign')
	else
		render('home')
}).setName('home')

Router.set('/about', () => {
	render('about')
})

Router.set('/login', () => {
	render('login')
})

Router.set('/pong', async () => {
	if (!await user())
		render('sign')
	else {
		render('pong')
		await new Promise(resolve => setTimeout(resolve, 10))
		import("../js/pong.js").then(async m => {
			await m.reset()
			m.connect_hub()
		})
	}
})

Router.set('/user/{username}', async (match) => {
	const response = await api(`/user/${match[1]}`, 'GET', {}, await user_token())
	const data = await response.json()

	if (!response.ok) {
		return console.log(data)
	}

	render('profile', {
		avatar: data.avatar,
		username: data.username,
		wins: data.wins,
		games: data.games,
		winrate: data.winrate,
	})

	const r = await api(`/user/${match[1]}/games/`, 'GET', {}, await user_token())
	const games = await r.json()
	const section = document.querySelector('#games')

	console.log(games)

	if (games.length > 0)
	{
		for (const game of games)
		{
			if (game.mode == "QuickGame")
			{
				section.innerHTML += `<c-quickgame class="list-group-item" target-user-username="${game.target_user_info.user.username}" target-user-score="${game.target_user_info.score}" opponent="${game.adversaries[0].user.username}" opponent-score="${game.adversaries[0].score}" has_won="${game.target_user_info.win}"></c-quickgame>`
			}
			else if (game.square)
			{
				section.innerHTML += `<c-squaregame class="list-group-item" player-winner-score="${game.score}" player-1-username="${game.target_user_info.user.username}" player-1-score="${game.target_user_info.score}" player-2-username="${game.adversaries[0].user.username}" player-2-score="${game.adversaries[0].score}" player-3-username="${game.adversaries[1].user.username}" player-3-score="${game.adversaries[1].score}" player-4-username="${game.adversaries[2].user.username}" player-4-score="${game.adversaries[2].score}"></c-squaregame>`
			}
			else
			{
				section.innerHTML += `<c-teamgame class="list-group-item" has_won="${game.target_user_info.win}" team-1-score="${game.target_user_info.score}" team-2-score="${game.adversaries[2].score}" player-1-username="${game.target_user_info.user.username}" player-2-username="${game.adversaries[0].user.username}" player-3-username="${game.adversaries[1].user.username}" player-4-username="${game.adversaries[2].user.username}"></c-teamgame>`
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
})

Router.notFound(() => {
    render('404')
})