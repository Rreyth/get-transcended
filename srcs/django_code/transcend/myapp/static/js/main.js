async function loadPage(page, id) {
	try {
		let ftch = await fetch(page);
		let resp = await ftch.text();
		document.getElementById(id).innerHTML = resp;
	}
	catch(error){
		console.error('Error loading page:', error);
	}
}

const router = async () => {
	const routes = [
		//"/404",
        { path: "/home", fetch: "home/" },
        { path: "/about", fetch: "about/" },
        { path: "/login", fetch: "login/" },
	];

	routes.forEach(route => {
		if (location.pathname.startsWith(route.path)){
			loadPage(route.fetch, 'content');
			return;
		}
	})
};


const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

window.onload = router();

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.addEventListener("click", e => {
		if (e.target.localName == "a" && e.target.id != 1){
			e.preventDefault();
			navigateTo(e.target.href);
			console.log('Button clicked');
		}
	});
})

export {router}
