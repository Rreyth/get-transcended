async function loadPage(page) {
	try {
		var ftch = await fetch(page);
		var resp = await ftch.text();
		document.querySelector('my-navbar').innerHTML = resp;
	}
	catch(error){
		console.error('Error loading page:', error);
	}
}

class Navbar extends HTMLElement{
	constructor(){
		super();
	}

	connectedCallback(){
		loadPage("/static/html/navbar.html");
	}
}

customElements.define("my-navbar", Navbar)
