import { MyRouter } from "../../js/MyRouter.js";
import { APIRequest, getAvatarUrl } from "../../js/helpers.js";

export class Profile extends HTMLElement {
	async connectedCallback() {
		let html = `
			<div class="mx-auto pt-4 d-flex flex-column gap-4" style="max-width: 70%;">
				<div class="d-flex align-items-center justify-content-between">
					<div class="d-flex align-items-center gap-4">
						<c-avatar src="{{ avatar }}" style="width: 8em; height: 8em;" username="{{ username }}"
							connected="{{ connected }}"></c-avatar>
						<h2>{{ username }}</h2>
					</div>
					<button is="c-friend-btn" class="btn btn-lg" id="btn-friend" target_username="{{ target_username }}"
						target_id="{{ target_id }}">Add friend</button>
				</div>
				<!-- <c-profileheader avatar="{{ avatar }}" username="{{ username }}" connected="{{ connected }}" ></c-profileheader> -->
				<div class="card-group text-center">
					<c-profilecard title="Total wins" value="0"></c-profilecard>
					<c-profilecard title="Total games" value="0"></c-profilecard>
					<c-profilecard title="Winrate" value="0"></c-profilecard>
				</div>
				<div>
					<select class="form-select" id="games-filter">
						<option value="all" selected>ALL</option>
						<option value="1v1">1V1</option>
						<option value="2v2">2V2</option>
						<option value="1v3">1V3</option>
					</select>
				</div>
				<div class="list-group" id="games">
				</div>
			</div>
		`;

		const url = window.location.pathname;
		const user = url.substring(url.lastIndexOf('/') + 1);
		const response = await APIRequest.build(`/user/${user}`, 'GET').send()
		const data = await response.json()

		if (response.status == 404) {
			MyRouter.push('404') // yessss
		}

		let context = {
			avatar: getAvatarUrl(data.avatar),
			username: data.username,
			connected: data.online,
			wins: data.wins,
			games: data.games,
			winrate: data.winrate,
			target_username: user,
			target_id: data.id,
		}

		for (const property in context) {
			html = html.replaceAll(`{{ ${property} }}`, context[property]);
		}
		this.innerHTML = html;

		const r = await APIRequest.build(`/user/${user}/games/`, 'GET').send()

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

	}

	static getName() {
		return "profile";
	}

	static getExtends() {
		return {};
	}
}
