import { Router } from "../js/router.js"

export class Link extends HTMLAnchorElement {
	connectedCallback() {
		this.addEventListener("click", this.handleClick);
	}

	disconnectedCallback() {
		this.removeEventListener("click", this.handleClick);
	}

	handleClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		Router.push(this.href);
	}

	static getName() {
		return "link";
	}

	static getExtends() {
		return { extends: "a" };
	}
}
