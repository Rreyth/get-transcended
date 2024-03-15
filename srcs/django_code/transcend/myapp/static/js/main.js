async function loadPage(page, id) {
	try {
		let ftch = await fetch(page);
		let resp = await ftch.text();
		let div = resp.substring(resp.indexOf("<div id=\"content\">") + 19, resp.lastIndexOf("</div>"))
		document.getElementById(id).innerHTML = div;
		let title = resp.substring(resp.indexOf("<title>") + 7, resp.lastIndexOf("</title>"))
		document.title = title;
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
		}
	})

	//console.log(document.querySelector('title'))
	//document.title = document.querySelector('title').value;
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
