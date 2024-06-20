export class ProfileCard extends HTMLElement {
	connectedCallback() {
		this.classList.add("card");

		this.innerHTML = `
			<div class="card-body">
				<h5 class="card-title">${this.getAttribute("title")}</h5>
				<p class="card-text">${this.getAttribute("value")}</p>
			</div>
		`;
	}

	static getName() {
		return "profilecard";
	}

	static getExtends() {
		return {};
	}
}
