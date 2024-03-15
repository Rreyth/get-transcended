async function loadPage(page, id, bool) {
	try {
		let ftch = await fetch(page);
		let resp = await ftch.text();
		document.querySelector(id).innerHTML = resp;
	}
	catch(error){
		console.error('Error loading page:', error);
	}
}

const router = async () => {
	const routes = [
		// { path: "/404", view: NotFound },
		{ path: "/home", link: "/static/html/home.html" },
		{ path: "/about", link: "/static/html/chat.html" },
		{ path: "/login", link: "/static/html/login.html" },
	];

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			result: location.pathname.startsWith(route.path),
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
			console.log('Button clicked');
		}
	});
});
