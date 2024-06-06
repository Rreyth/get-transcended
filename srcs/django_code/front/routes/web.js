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

	const r = await api(`/user/${match[1]}/games/`, 'GET', {}, await user_token())
	const d = await r.json()
	console.log(d)

	render('profile', {
		avatar: data.avatar,
		username: data.username,
		wins: data.wins,
		games: data.games,
		winrate: data.winrate,
	})
})

Router.notFound(() => {
    render('404')
})