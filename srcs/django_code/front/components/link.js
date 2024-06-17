import { MyRouter } from "../js/MyRouter.js"

export class Link extends HTMLAnchorElement {
	connectedCallback() {
		this.addEventListener("click", this.handleClick, true);
	}

	handleClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		MyRouter.push(this.href);
	}

	static getName() {
		return "link";
	}

	static getExtends() {
		return { extends: "a" };
	}
}
