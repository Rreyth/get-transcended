import { Component } from "../js/component.js";
import { user, api, user_token, getAvatarUrl } from "../js/helpers.js"


export class Settings extends Component {
	static getName() {
		return "settings";
    }
	
    async connectedCallback() {
		const userValue = await user();
		let a2fStatus = await api("/user/a2f","GET", null, await user_token());
		a2fStatus = (await a2fStatus.json()).actived

		this.innerHTML = await content(userValue, a2fStatus);

		const saveBtn = this.querySelector("#save-btn");
		const cpassInput = this.querySelector("#cpass-input");
		const avatarBtn = this.querySelector("#avatar-btn");

		this.querySelectorAll("input[filter]").forEach(el => {
			el.oninput = () => {
				if ([...this.querySelectorAll("input[filter]")].some(e => e.type != "checkbox" ? e.value.length : e.checked != a2fStatus))
				{	
					saveBtn.removeAttribute("disabled");
					if (!userValue.login42)
						cpassInput.removeAttribute("disabled");
				}
				else
				{
					saveBtn.setAttribute("disabled", "");
					cpassInput.setAttribute("disabled", "");
				}
			}
		})

		avatarBtn.onclick = () => {document.getElementById('fileInput').click();};
		document.getElementById('fileInput').onchange = () => {
			const file = document.getElementById('fileInput').files[0]
			if (file)
				document.getElementById('profile-img').src = URL.createObjectURL(file);
			else
				document.getElementById('profile-img').src = getAvatarUrl(userValue.avatar);
		}

		saveBtn.onclick = () => {
			console.log("coucou");
		}
    }
}

const content = async (user, a2f) => /*html*/`
	<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">Settings</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">

					<div class="container overflow-hidden text-center">
						<div class="row justify-content-md-between">

							<div class="col-md-auto d-flex justify-content-center align-items-center mx-2 my-2">
								<div class="d-flex align-items-center justify-content-evenly w-100">
									<img class="rounded-4" id="profile-img" src="${getAvatarUrl(user.avatar)}" style="width: 6em; height: 6em; object-fit: cover; object-position: center;"/>
									<div class="d-flex flex-column align-items-start ms-3">
										<span style="font-size: 1.3em;">Profile picture</span>
										<span style="font-size: 0.8em; margin-bottom: 0.4em; color: grey;">jpg - png - gif</span>
										<button type="button" id="avatar-btn" class="btn btn-outline-secondary">Upload</button>
									</div>
								</div>
							</div>
							<div class="col-md-auto d-flex flex-column justify-content-center align-items-center mx-2 my-2">
								<span>Auth A2F</span>
								<div class="form-check form-switch">
									<input class="form-check-input" filter id="a2f-switch" type="checkbox" role="switch" ${a2f ? "checked" : ""}>
								</div>
							</div>

						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3 mt-5">
							<input class="form-control mx-2" filter id="user-input" type="text" placeholder="${user.username}">
						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3">
							<input class="form-control mx-2" filter id="email-input" type="email" placeholder="${user.email}">
						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3">
							<input class="form-control mx-2" filter id="newpass-input" type="password" placeholder="New password" ${user.login42 ? "disabled" : ""}>
						</div>

					</div>
				</div>

				<div class="modal-footer justify-content-between">
					<div class="d-flex">
						<input class="form-control mx-2" id="cpass-input" type="password" placeholder="Current password" disabled>
					</div>
					<div>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" id="save-btn" class="btn btn-primary" disabled>Save</button>
					</div>
				</div>
				
			</div>
		</div>
	</div>
	<input type="file" filter id="fileInput" name="profile_picture" accept="image/*" style="display: none;" />
`;
