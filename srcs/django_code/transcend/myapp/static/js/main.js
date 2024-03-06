function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
				document.getElementById('content').innerHTML = html;
		})
			.catch(error => console.error('Error loading page:', error));
}


const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};


const router = async () => {
    const routes = [
        // { path: "/404", view: NotFound },
        { path: "/", link:"home.html" },
        { path: "/home", link:"home.html" },
        { path: "/about", link: "about.html" },
        { path: "/login", link: "login.html" },
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
    loadPage(match.route.path);
};



window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
		e.preventDefault();
		navigateTo(e.target.href);
		//router();
		console.log('Button clicked');
    });
});
