import { Component } from "../js/component.js";
import { user, translate, token_checker } from "../js/helpers.js";
import { Chat } from "./chat.js";

export class Navbar extends Component {
	static getName() {
		return "nav";
	}

	async connectedCallback() {

		// utils pour refresh un composant au besoin
		window.removeEventListener("refreshUser", this.test.bind(this));
		window.addEventListener("refreshUser", this.test.bind(this));
	}

	async test() {

		console.log("navbar refreshed");

		await token_checker();
		const userInfo = await user();

		if (userInfo != null)
		{
			this.innerHTML = await content(userInfo);

			document.addEventListener("click", (e) => {
				if (e.target.id == "seach-user")
				{
					this.querySelector(".dropdown-menu").innerHTML = `<c-search content="${e.target.value}"></c-search>`;
					this.querySelector(".dropdown-toggle").click();
				}
				else if (e.target.classList.contains("bx"))
				{
					if (e.target.parentNode.classList.contains("dropdown-toggle"))
					{
						this.querySelector(".dropdown-menu").innerHTML = "<c-navprofile></c-navprofile>";
					}
				}
			})

			this.querySelector("#seach-user").addEventListener("input", (e) => {
				let content = this.querySelector(".dropdown-menu");
				content.innerHTML = `<c-search content="${e.target.value}"></c-search>`;
			})

			this.querySelector("#msg-btn").addEventListener("click", (e) => {
				Chat.openOrClose()
			})
		}
		else
			this.innerHTML = "";
	}
}


const content = async (user) => /* html */ `
	<nav class="navbar fixed-bottom navbar-expand bg-body-tertiary user-select-none">
		<div class="container-fluid text-center">


			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse justify-content-between" id="navbarNav">

				<div class="d-flex align-items-center justify-content-center">
					<div class="d-flex align-items-center justify-content-center p-2 mx-2" style="width: 3em; height: 3rem;">
						<div class="btn-group dropup">
							<span class="d-flex align-items-center justify-content-center bg-secondary rounded-4 dropdown-toggle" id="content-none" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" style="cursor: pointer; width: 3em; height: 3rem;">
								<i class='bx bx-user bx-md'></i>
							</span>
							<div class="dropdown-menu mb-2" style="margin-left: -1.5em; height: 25em; width: 22em;">
								<!-- User menu or search -->
							</div>
						</div>
					</div>
					<div class="px-2">

						<div class="form-outline position-relative">
							<input id="seach-user" type="text" class="form-control ps-5 rounded-4" placeholder="${await translate('nav.user')}" style="height: 3rem;"/>
							<i class="bx bx-search-alt bx-md ms-3 text-primary position-absolute" style="top: 0.2em; left: -0.2em; pointer-events: none;"></i>
						</div>

					</div>
				</div>
				<div class="d-flex align-items-center justify-content-center gap-4">
					<c-navbarbutton href="/" src="/media/google_svgs/home.svg"></c-navbarbutton>
					<c-navbarbutton href="/user/${user.username}" src="/media/google_svgs/user.svg"></c-navbarbutton>
					<c-navbarbutton href="/pong" src="/media/google_svgs/videogame.svg"></c-navbarbutton>
					<c-navbarbutton show-on-click="about-container" src="/media/google_svgs/info.svg"></c-navbarbutton>
				</div>

				<div class="d-flex align-items-center justify-content-center">
					<div class="d-flex align-items-center justify-content-center bg-secondary p-2 mx-2 rounded-4" id="msg-btn" style="width: 14em; height: 3rem;">
						<i class='bx bx-chat bx-md' ></i>
						<span class="w-100">MESSAGES</span>
					</div>
					<div class="mx-2" style="height: 3rem; width: 3em;">
						<c-langbtn></c-langbtn>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<c-chat-body id="chat"></c-chat-body>
`;
