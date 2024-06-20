import { MyRouter } from "../../js/MyRouter.js";
import { user, APIRequest, user_token } from "../../js/helpers.js";

export class Leaderboard extends HTMLElement {
	async connectedCallback() {
		let html = `
			<div class="container-fluid text-center h-100">
				<div class="justify-content-center h-100">
					<div class="col">
						<c-clock class="d-flex flex-column"></c-clock>
					</div>
					<div class="col d-flex justify-content-center mt-5">

						<div class="card">
							<div class="card-header">
								<c-podium winners='{{ winners }}'></c-podium>
							</div>
							<div class="card-body overflow-auto" style="max-height: 25em;">
								<ul class="list-group list-group-flush" id="board-user-container">
									<!-- user content -->
								</ul>
							</div>
						</div>

					</div>
				</div>
			</div>
		`;

		// todo: await user() == null pas suffisant pour detecter si l'utilisateur n'est pas login (faire une fonction)
		if (await user() == null)
			MyRouter.push('login');

		const response = await APIRequest.build("/user/leaderboard", "GET").send();
		const users = await response.json();

		let context = {
			winners: JSON.stringify(users)
		}

		for (const property in context) {
			html = html.replaceAll(`{{ ${property} }}`, context[property]);
		}
		this.innerHTML = html;

		let userContainer = document.querySelector("#board-user-container");

		users.forEach((e, index) => {
			const el = document.createElement('c-leaduser');
			el.setAttribute("id", index + 1);
			el.setAttribute("name", e.username);
			el.setAttribute("wins", e.wins);

			el.classList.add("list-group-item", "d-flex", "justify-content-between");

			userContainer.appendChild(el);
		})
	}

	static getName() {
		return "leaderboard";
	}

	static getExtends() {
		return {};
	}
}
