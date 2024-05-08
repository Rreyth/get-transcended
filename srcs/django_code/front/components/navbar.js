import { Component } from "../js/component.js";
import { user } from "../js/helpers.js";

export class Navbar extends Component {
	static getName() {
		return "nav";
	}

	async connectedCallback() {
		// if (await user() != null)
		// {
		this.innerHTML = content;

		document.addEventListener("click", (e) => {
			if (e.target.id == "seach-user")
			{
				this.querySelector(".dropdown-toggle").click();
			}
		})


		this.querySelector("#seach-user").addEventListener("input", (e) => {
			let content = this.querySelector(".dropdown-menu");
			content.innerHTML = `<c-search content="${e.target.value}"></c-search>`;
		})
		// }
	}
}

const content = /* html */ `
	<nav class="navbar fixed-bottom navbar-expand-lg bg-body-tertiary user-select-none">
		<div class="container-fluid text-center">


			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse justify-content-between" id="navbarNav">

				<div class="d-flex align-items-center justify-content-center">
					<div class="d-flex align-items-center justify-content-center p-2 mx-2" style="width: 3em; height: 3em;">
						<div class="btn-group dropup">
							<span class="d-flex align-items-center justify-content-center bg-secondary rounded-4 dropdown-toggle" id="content-none" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" style="cursor: pointer; width: 3em; height: 3em;">
								<i class='bx bxs-cog bx-md'></i>
							</span>
							<div class="dropdown-menu mb-2" style="margin-left: -1.5em; height: 25em; width: 22em;">
								<!-- User menu or search -->
							</div>
						</div>
					</div>
					<div class="px-2">

						<div class="form-outline">
							<input id="seach-user" type="text" class="form-control ps-5 rounded-4" placeholder="User" style="height: 3em;"/>
							<i class="bx bx-search-alt bx-md ms-3 text-primary" style="position: absolute; transform: translate(-385%,-125%); pointer-events: none;"></i>
						</div>

					</div>
				</div>
				<div class="d-flex align-items-center justify-content-center">
					<div class="d-flex align-items-center justify-content-center bg-secondary p-2 mx-2 rounded-4" style="cursor: pointer; width: 3em; height: 3em;">
						<i class='bx bx-history bx-md'></i>
					</div>
					<div class="d-flex align-items-center justify-content-center bg-secondary p-2 mx-2 rounded-4" style="cursor: pointer; width: 3em; height: 3em;">
						<i class='bx bx-joystick bx-md'></i>
					</div>
					<div class="d-flex align-items-center justify-content-center bg-secondary p-2 mx-2 rounded-4" style="cursor: pointer; width: 3em; height: 3em;">
						<i class='bx bx-info-circle bx-md'></i>
					</div>
				</div>

				<div class="d-flex align-items-center justify-content-center">
					<div class="d-flex align-items-center justify-content-center bg-secondary p-2 mx-2 rounded-4" style="width: 14em; height: 3em;">
						<i class='bx bx-chat bx-md' ></i>
						<span class="w-100">MESSAGES</span>
					</div>
					<div class="mx-2" style="height: 3em; width: 3em;">
						<c-langbtn></c-langbtn>
					</div>
				</div>



			</div>


		</div>
	</nav>
`;
