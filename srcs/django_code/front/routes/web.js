import { Router, render } from "../js/router.js";
import { user } from "../js/helpers.js"

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
	render('pong')
	await new Promise(resolve => setTimeout(resolve, 10))
	import("../js/pong.js").then(m => {
		m.connect_hub()
	})
})

Router.notFound(() => {
    render('404')
})