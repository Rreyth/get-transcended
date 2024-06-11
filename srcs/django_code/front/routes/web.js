import { Router, render } from "../js/router.js";
import { APIRequest, formatDate, user, getAvatarUrl } from "../js/helpers.js"

Router.notFound(() => {
    render('404')
})

Router.set('/', async () => {
	if (await user() == null)
		render('sign')
	else
		render('home')
}).setName('home')

Router.set('/about', () => {
	render('about')
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
	const response = await APIRequest.build(`/user/${match[1]}`, 'GET').send()
	const data = await response.json()

	if (response.status == 404) {
		return render('404')
	}

	render('profile', {
		avatar: getAvatarUrl(data.avatar),
		username: data.username,
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
				subSection.innerHTML += `<c-quickgame class="list-group-item" at="${new Date(game.created_at).getHours()}h${new Date(game.created_at).getMinutes()}min" target-user-username="${game.target_user_info.user.username}" target-user-score="${game.target_user_info.score}" opponent="${game.adversaries[0].user.username}" opponent-score="${game.adversaries[0].score}" has_won="${game.target_user_info.win}"></c-quickgame>`
			}
			else if (game.square)
			{
				subSection.innerHTML += `<c-squaregame class="list-group-item" at="${new Date(game.created_at).getHours()}h${new Date(game.created_at).getMinutes()}min" player-winner-score="${game.score}" player-1-username="${game.target_user_info.user.username}" player-1-score="${game.target_user_info.score}" player-2-username="${game.adversaries[0].user.username}" player-2-score="${game.adversaries[0].score}" player-3-username="${game.adversaries[1].user.username}" player-3-score="${game.adversaries[1].score}" player-4-username="${game.adversaries[2].user.username}" player-4-score="${game.adversaries[2].score}"></c-squaregame>`
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
				
				subSection.innerHTML += `<c-teamgame class="list-group-item" at="${new Date(game.created_at).getHours()}h${new Date(game.created_at).getMinutes()}min" has_won="${game.target_user_info.win}" team-1-score="${game.target_user_info.score}" team-2-score="${otherScore}" player-1-username="${game.target_user_info.user.username}" player-2-username="${game.players[indexOfMate].user.username}" player-3-username="${players[0]}" player-4-username="${players[1]}"></c-teamgame>`
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