import { Router, render } from "../js/router.js";

Router.set('/', () => {
	render('home')
}).setName('home')

Router.set('/about', () => {
	render('about')
})

Router.set('/login', () => {
	render('login')
})

Router.set('/pong', () => {
	render('pong')
	import("../js/pong.js").then(m => {
		m.connect_hub()
	})
})

Router.notFound(() => {
    render('404')
})