import { Component } from "../../js/component.js";
import { APIRequest } from "../../js/helpers.js";

export class A2fModal extends Component {
    static getName() {
        return "a2fmodal";
    }

    async connectedCallback() {
		const username = this.getAttribute("username");
		const password = this.getAttribute("password");
		this.innerHTML = content(username);

		const btModal = this.querySelector("#a2f-bt-modal");
		btModal.click();

		const btSave = this.querySelector("#a2f-save");
		const codeInput = this.querySelector("#a2f-code-input");

	
		btSave.onclick = async() => {
			let response = null;
			let res = null;
			if (this.getAttribute("type") == "log42")
			{
				const bodyPrepare = new FormData();
				bodyPrepare.append("username", username);
				bodyPrepare.append("a2f_code", codeInput.value);
				response = await APIRequest.build("/user/a2fConnexion", "POST").setBody(bodyPrepare).send();
				res = await response.json();
			}
			else if (this.getAttribute("type") == "log")
			{
				const bodyPrepare = new FormData();
				bodyPrepare.append("username", username);
				bodyPrepare.append("password", password);
				bodyPrepare.append("otp_token", codeInput.value);
				response = await APIRequest.build("/token/", "POST").setBody(bodyPrepare).send();
				res = await response.json();
			}
			if (response && response.ok && res.access)
			{
				cookieStore.set({name: 'token', value: res.access});
				location.href = location.href.split('?')[0]; //need change
			}
			else
			{
				console.log(res);
				//bad code
			}
		}
    }
}

const content = (username) => /*html*/`
	<button id="a2f-bt-modal" style="display: none;" data-bs-toggle="modal" data-bs-target="#a2f-modal"></button>
	<div class="modal fade" id="a2f-modal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5">${username}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<input class="form-control" id="a2f-code-input" type="text" placeholder="Your a2f code"><!-- need translation -->
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button id="a2f-save" type="button" class="btn btn-primary">Save changes</button>
				</div>
			</div>
		</div>
	</div>
`;
