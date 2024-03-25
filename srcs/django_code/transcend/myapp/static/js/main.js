async function loadPage(page, id, bool) {
	try {
		let ftch = await fetch(page);
		let resp = await ftch.text();
		document.querySelector(id).innerHTML = resp;

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
	}
	catch(error){
		console.error('Error loading page:', error);
	}
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
			console.log('Button clicked');
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
