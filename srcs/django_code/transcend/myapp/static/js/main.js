function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
				document.querySelector('body').innerHTML = html;
		})
			.catch(error => console.error('Error loading page:', error));
}

const router = async () => {
    const routes = [
        // { path: "/404", view: NotFound },
        { path: "/", link:"static/html/home.html" },
        { path: "/home", link:"static/html/home.html" },
        { path: "/about", link: "static/html/about.html" },
        { path: "/login", link: "static/html/login.html" },
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
    loadPage(match.route.link);
};


const navigateTo = url => {
	history.pushState(null, null, url);
    router();
};

window.onload = router();

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
		if (!e.target.name){
			e.preventDefault();
			navigateTo(e.target.href);
			console.log('Button clicked');
		}
    });
});
