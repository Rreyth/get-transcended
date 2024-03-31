import { Component } from "./component.js"
import { Navbar } from "../html/components/navbar.js";
import { Minichat } from "../html/components/minichat.js";

Component.loader([
	Navbar,
	Minichat,
])

function loadPage(page, id) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.querySelector(id).innerHTML += html;
			const scriptTags = document.querySelector(id).getElementsByTagName('script');
			for (let i = 0; i < scriptTags.length; i++) {
				const src = scriptTags[i].getAttribute('src');
				if (src) {
				const script = document.createElement('script');
				script.src = src;
				document.body.appendChild(script);
				} else {
				// Exécuter les scripts inline directement
				eval(scriptTags[i].innerText);
				}
			}
        })
        .catch(error => console.error('Error loading page:', error));
}

const router = async () => {
	const routes = [
		{ path: "/404", link: "/static/html/404.html" },
		{ path: "/", link: "/static/html/home.html" },
		{ path: "/about", link: "/static/html/about.html" },
		{ path: "/login", link: "/static/html/login.html" },
	];

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			result: location.pathname == route.path,
		};
	});

	let match = potentialMatches.find(potentialMatch => potentialMatch.result !== false);

	if (!match) {
		match = {
			route: routes[0],
			result: [location.pathname]
		};
	}
	loadPage(match.route.link, 'body');
};


const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

window.onload = router();

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.localName == "a" && e.target.id != 1){
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});
});



function addInPage(page, id) {
	fetch(page)
		.then(response => response.text())
		.then(html => {
			document.getElementById(id).innerHTML = html;


			const scriptTags = document.getElementById(id).getElementsByTagName('script');
			for (let i = 0; i < scriptTags.length; i++) {
				const src = scriptTags[i].getAttribute('src');
				if (src) {
					const script = document.createElement('script');
					script.src = src;
					document.body.appendChild(script);
				} else {
					// Exécuter les scripts inline directement
					const script = document.createElement('script');
					script.textContent = scriptTags[i].innerText;
					document.body.appendChild(script);

				}
			}
		})
		.catch(error => console.error('Error loading page:', error));
}

function sendMsg(msg)
{
	const socket = new WebSocket('wss://localhost:44433/api/chat');

	socket.onopen = event => {
		console.log('WebSocket connection established.');
		socket.send(JSON.stringify({
			'message': msg
		}));
	};

	socket.onmessage = event => {
		const data = JSON.parse(event.data);
		console.log('Message from server:', data.message);
		displayNewMsg(data.message, 'me');
		displayNewMsg("Test response : " + data.message, 'nameOfSpeaker');
	};
}

const textareas = document.querySelector('textarea');

for (const key in textareas) {
	key.addEventListener('keydown', function (event) {
		if (event.key === 'Enter' && !event.shiftKey)
		{
			event.preventDefault();
			if (document.getElementById('myTextarea').value === '')
				return;
			let msg = escapeHtml(document.getElementById('myTextarea').value)
			sendMsg(msg.replace(/\n/g, "<br>"));
			document.getElementById('myTextarea').value = '';
		}
	});
}
