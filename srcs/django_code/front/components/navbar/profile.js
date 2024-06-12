import { Component } from "../../js/component.js";
import { user, getAvatarUrl, APIRequest } from "../../js/helpers.js"

export class NavProfile extends Component {

    static getName() {
        return "navprofile";
    }

	async connectedCallback() {
		super.connectedCallback();
		const userValue = await user();
		if (userValue != null) {
			this.innerHTML = content(userValue);

			const userRequest = await APIRequest.build("/user/", "GET").send();
			const userInfo = await userRequest.json();
			if (userRequest.ok)
			{
				this.querySelector("#winrate-info").innerHTML = userInfo.winrate + "%";
				this.querySelector("#win-game").innerHTML = userInfo.wins;
				this.querySelector("#game-played").innerHTML = userInfo.games;
			}
			else
			{
				// add error warning (notification ?)
			}
			this.querySelector("#leave-btn").onclick = () => {
				cookieStore.delete("token");
				location.reload();
			}
		}
	}

}

const content = (user) => /* html */ `
		<div class="w-100 h-100">
			<div class="mx-3 mt-2 d-flex" style="">
				<div>
					<c-avatar src="${user.avatar}" style="width: 7em; height: 7em;"></c-avatar>
				</div>
				<div class="d-flex flex-column justify-content-evenly mx-2 w-100">
					<span class="text-center w-100" style="font-size: 1.7em; overflow: hidden;">${user.username}</span>
					<div class="d-flex justify-content-evenly">
						<button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#settingsModal"><i class='bx bx-cog bx-sm' ></i></button>
						<button type="button" class="btn btn-outline-danger d-flex align-items-center justify-content-center" id="leave-btn"><i class='bx bx-exit bx-sm'></i></button>
					</div>
				</div>
			</div>
			<div class="mx-3 mt-5 d-flex align-item-center">
				<i class='bx bx-crown bx-sm' style="color: #FFD700;"></i> <span class="ms-2">Your winrate :</span> <span class="ms-2" id="winrate-info"></span>
			</div>

			<div class="mx-3 mt-3 d-flex align-item-center">
				<i class='bx bx-cool bx-sm' style="color: #27AE60;"></i></i> <span class="ms-2">Game win :</span> <span class="ms-2" id="win-game"></span>
			</div>

			<div class="mx-3 mt-3 d-flex align-item-center">
				<i class='bx bx-basketball bx-sm' style="color: #3498DB;"></i></i> <span class="ms-2">Game played :</span> <span class="ms-2" id="game-played"></span>
			</div>

			<div class="w-100 mt-3 d-flex flex-column align-items-center position-absolute bottom-0">
				<a href="/user/${user.username}" class="btn btn-outline-primary mb-3" style="width: 80%;">Profile</a>
			</div>
		</div>
	`;