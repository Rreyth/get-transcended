import { redirect } from "../js/router.js";

export class Link extends HTMLAnchorElement {
	connectedCallback() {
		this.addEventListener("click", this.handleClick, true);
	}

	handleClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		redirect(this.href);
	}

	static getName() {
		return "link";
	}

	static getExtends() {
		return { extends: "a" };
	}
}
