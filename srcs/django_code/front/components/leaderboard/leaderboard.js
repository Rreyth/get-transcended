import { MyRouter } from "../../js/MyRouter.js";
import { user, APIRequest, user_token, token_checker } from "../../js/helpers.js";

export class Leaderboard extends HTMLElement {
	async connectedCallback() {

		// todo: await user() == null pas suffisant pour detecter si l'utilisateur n'est pas login (faire une fonction)
		await token_checker();
		const userInfo = await user();
		if (userInfo == null)
			MyRouter.push('login');

		const response = await APIRequest.build("/user/leaderboard", "GET").send();
		const users = await response.json();

		let context = {
			winners: JSON.stringify(users)
		}

		this.innerHTML = content(context);

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

const content = (context) => /* html */`
	<div class="container-fluid text-center h-100">
		<div class="justify-content-center h-100">
			<div class="col">
				<c-clock class="d-flex flex-column"></c-clock>
			</div>
			<div class="col d-flex justify-content-center mt-5">

				<div class="card">
					<div class="card-header">
						<c-podium winners='${context.winners}'></c-podium>
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
