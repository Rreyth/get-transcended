async function loadPage(page, id) {
	try {
		var ftch = await fetch(page);
		var resp = await ftch.text();
		const rpl = document.createElement("div");
		rpl.innerHTML = resp;
		document.querySelector(id).replaceWith(rpl);
	}
	catch(error){
		console.error('Error loading page:', error);
	}
}

class loadfile extends HTMLElement{
	constructor(){
		super();
	}

	connectedCallback(){
		const file = this.getAttribute("file");
		loadPage(file, "load-file");
	}
}

customElements.define("load-file", loadfile);
