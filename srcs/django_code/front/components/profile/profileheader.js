export class ProfileCard extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex align-items-center gap-4">
					<c-avatar src="{{ avatar }}" style="width: 8em; height: 8em;" username="{{ username }}"
						connected="{{ connected }}"></c-avatar>
					<h2>{{ username }}</h2>
				</div>
				<button is="c-friend-btn" class="btn btn-lg" id="btn-friend" target_username="{{ target_username }}"
					target_id="{{ target_id }}">Add friend</button>
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
