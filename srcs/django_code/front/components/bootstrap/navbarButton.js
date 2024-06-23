import { MyRouter } from "../../js/MyRouter.js";

export class NavbarButton extends HTMLElement {
	connectedCallback() {
		this.classList.add("rounded-4", "clickable", "bg-secondary");

		this.innerHTML = `
			<img src="${this.getAttribute("src")}" style="width: 36px; height: 36px"></img>
		`;

		this.addEventListener("mouseover", this.test);
		if (this.getAttribute("show-on-click"))
			this.addEventListener("click", this.handleClickPopup);
		else
			this.addEventListener("click", this.handleClickHref);
	}

	handleClickPopup() {
		document.querySelector(`#${this.getAttribute("show-on-click")}`).style.display = 'block';
	}

	handleClickHref(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		MyRouter.push(this.getAttribute("href"));
	}

	test() {
		window.status = "home";
	}

	static getName() {
		return "navbarbutton";
	}

	static getExtends() {
		return {};
	}
}
