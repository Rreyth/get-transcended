import { Router, render } from "../js/router.js";

Router.set('/', () => {
	render('sign')

	// console.log(document)

	// document.querySelector('#sing-in-switch').addEventListener('click', (e) => {
	// 	document.querySelector("#sing-in-form").classList.remove("d-none")
	// 	document.querySelector("#sing-up-form").classList.add("d-none")
	// })

	// document.querySelector("#sing-up-switch").addEventListener('click', (e) => {
	// 	document.querySelector("#sing-in-form").classList.add("d-none")
	// 	document.querySelector("#sing-up-form").classList.remove("d-none")
	// })
}).setName('sign')

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