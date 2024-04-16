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

Router.notFound(() => {
    render('404')
})