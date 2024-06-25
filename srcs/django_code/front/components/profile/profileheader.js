import { translate } from "../../js/helpers.js"

export class ProfileHeader extends HTMLElement {
	async connectedCallback() {
		this.innerHTML = /* html */`
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex align-items-center gap-4">
					<c-avatar src="${this.getAttribute("avatar")}" style="width: 8em; height: 8em;" username="${this.getAttribute("username")}"
						connected="${this.getAttribute("connected")}"></c-avatar>
					<h2>${this.getAttribute("username")}</h2>
				</div>
				<button is="c-friend-btn" class="btn btn-lg" id="btn-friend" target_username="${this.getAttribute("target_username")}"
					target_id="${this.getAttribute("target_id")}" data-trd-friend="${this.getAttribute("target_username")}">${ await translate("profile.add_friend") }
				</button>
			</div>
		`;
	}

	static getName() {
		return "profileheader";
	}

	static getExtends() {
		return {};
	}
}
