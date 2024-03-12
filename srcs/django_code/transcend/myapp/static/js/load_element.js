async function loadPage(page, id, replace_id) {
	try {
		let ftch = await fetch(page);
		let resp = await ftch.text();
		const rpl = document.createElement(replace_id);
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
		loadPage(file, "load-file", "div");
	}
}

customElements.define("load-file", loadfile);
