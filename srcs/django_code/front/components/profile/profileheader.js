export class ProfileHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex align-items-center gap-4">
					<c-avatar src="${this.getAttribute("avatar")}" style="width: 8em; height: 8em;" username="${this.getAttribute("username")}"
						connected="${this.getAttribute("connected")}"></c-avatar>
					<h2>${this.getAttribute("username")}</h2>
				</div>
				<button is="c-friend-btn" class="btn btn-lg" id="btn-friend" target_username="${this.getAttribute("target_username")}"
					target_id="${this.getAttribute("target_id")}">Add friend
				</button>
			</div>
		`;
	}

	// todo: rajouter un if sur le <button> comme ça pas besoin de l'afficher puis le supprimer

	static getName() {
		return "profileheader";
	}

	static getExtends() {
		return {};
	}
}
