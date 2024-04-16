import { Router, render, route } from "../js/router.js";

Router.set('/test', () => {
	render('home')
}).setName('home')

Router.set('/about', () => {
    console.log(route('home'))

	render('about')
})

Router.set('/login', () => {
	render('login')
})

Router.notFound(() => {
    render('404')
})