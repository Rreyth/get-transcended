import { Component } from "../js/component.js";
import { user, getAvatarUrl, APIRequest, translate } from "../js/helpers.js"
import { Router } from "../js/router.js"


export class Settings extends Component {
	static getName() {
		return "settings";
    }
	
    async connectedCallback() {
		const userValue = await user();
		let a2fStatus = await APIRequest.build("/user/a2f", "GET").send();
		a2fStatus = (await a2fStatus.json()).actived

		this.innerHTML = await content(userValue, a2fStatus);

		const saveBtn = this.querySelector("#save-btn");
		const avatarBtn = this.querySelector("#avatar-btn");
		const username = this.querySelector("#user-input");
		const email = this.querySelector("#email-input");
		const test = this.querySelector("#exampleModal");exampleModal

		test.addEventListener ("show.bs.modal", () => {
			console.log("reload content here");
		})
		

		this.querySelectorAll("input[filter]").forEach(el => {
			el.oninput = () => {
				if ([...this.querySelectorAll("input[filter]")].some(e => e.type != "checkbox" ? e.value.length : e.checked != a2fStatus))
					setSaveState(true, userValue.login42);
				else
					setSaveState(false, null)
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

		const newpassword = this.querySelector("#newpass-input");
		const badNewPswd = this.querySelector("#error-pswd");


		email.onblur = () => {
			if (email.value != "")
			{
				if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)))
				{
					email.classList.add("is-invalid");
					setSaveState(false, null);
				}
				else
				{
					email.classList.remove("is-invalid");
					setSaveState(true, userValue.login42);
				}
			}
			else
				email.classList.remove("is-invalid");
		}

		username.onblur = () => {
			if (username != "")
			{
				if (username.value.length > 10)
				{
					username.classList.add("is-invalid");
					setSaveState(false, null);
				}
				else
				{
					username.classList.remove("is-invalid");
					setSaveState(true, userValue.login42);
				}
			}
			else
				username.classList.remove("is-invalid");
		}
		
		newpassword.onblur = () => {
			if (newpassword.value != "")
			{
				if (!(/[A-Z]/.test(newpassword.value)) || !(/[a-z]/.test(newpassword.value)) || !(/[0-9]/.test(newpassword.value)) || newpassword.value.length < 8)
				{
					newpassword.classList.add("is-invalid");
					badNewPswd.style.display = "block";
					setSaveState(false, null);
				}
				else
				{
					newpassword.classList.remove("is-invalid");
					badNewPswd.style.display = "none";
					setSaveState(true, userValue.login42);
				}
			}
			else
			{
				newpassword.classList.remove("is-invalid");
				badNewPswd.style.display = "none";
			}
		}

		const allInput = this.querySelectorAll("input");
		const closeBtn = this.querySelector("#closeModal");
		const errorBox = this.querySelector("#error-container");

		saveBtn.onclick = async () => {
			const bodyPrepare = new FormData();
			allInput.forEach(input => {
				if (input.value)
				{
					bodyPrepare.append(input.name, input.type == "checkbox" ? input.checked : input.value);
					if (input.type == "file")
					{
						bodyPrepare.append(input.name, input.files[0]);
					}
				}
			});
			const response = await APIRequest.build("/user/", "PUT").setBody(bodyPrepare).send();
			const data = await response.json();
			if (response.ok)
			{
				cookieStore.set({ name: "token", value: data.access});
				closeBtn.click();
				Router.run();
				// add success msg
			}
			else
			{
				errorBox.innerHTML = /*html*/`
				<div class="alert position-relative top-0 w-100 alert-warning alert-dismissible d-flex" role="alert">
					<i class='bx bx-error-alt bx-sm' style="margin-right: 0.4em;"></i>
					<span id="api-error-txt">${await translate("settings." + data.error)}</span>
					<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>`
			}
		}
    }
}

const setSaveState = (setToEnable, isLog42) => {
	const saveBtn = document.querySelector("#save-btn");
	const currentPass = document.querySelector("#cpass-input");
	if (setToEnable)
	{
		saveBtn.removeAttribute("disabled");
		if (!isLog42)
			currentPass.removeAttribute("disabled");
	}
	else
	{
		saveBtn.setAttribute("disabled", "");
		currentPass.setAttribute("disabled", "");
	}
}

const content = async (user, a2f) => /*html*/`
	<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div id="error-container"></div>
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">Settings</h1>
					<button type="button" class="btn-close" id="closeModal" data-bs-dismiss="modal" aria-label="Close"></button>
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
									<input name="a2f" class="form-check-input" filter id="a2f-switch" type="checkbox" role="switch" ${a2f ? "checked" : ""}>
								</div>
							</div>

						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3 mt-5">
							<input name="username" class="form-control mx-2" filter id="user-input" type="text" placeholder="${user.username}">
						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3">
							<input name="email" class="form-control mx-2" filter id="email-input" type="email" placeholder="${user.email}">
						</div>

						<div class="col-md d-flex justify-content-center align-items-center mt-3 mb-1">
							<input name="password" class="form-control mx-2" filter id="newpass-input" type="password" placeholder="New password" ${user.login42 ? "disabled" : ""}>
						</div>
						<div class="col-md d-flex justify-content-start align-items-center">
							<span class="ms-3 text-danger" id="error-pswd" style="display: none; font-size: 0.8em;">doit contenir maj min nombre et >=8<span>
						</div>
						

					</div>
				</div>

				<div class="modal-footer justify-content-between">
					<div class="d-flex">
						<input name="current_password" class="form-control mx-2" id="cpass-input" type="password" placeholder="Current password" disabled>
					</div>
					<div>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" id="save-btn" class="btn btn-primary" disabled>Save</button>
					</div>
				</div>
				
			</div>
		</div>
	</div>
	<input type="file" filter id="fileInput" name="avatar" accept="image/*" style="display: none;" />
`;
