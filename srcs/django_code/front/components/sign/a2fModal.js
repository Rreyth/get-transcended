import { Component } from "../../js/component.js";
import { APIRequest } from "../../js/helpers.js";

export class A2fModal extends Component {
    static getName() {
        return "a2fmodal";
    }

	username = "";

	static setWho(username)
	{
		this.username = username;
	}

    async connectedCallback() {
		this.innerHTML = await content(this.username);

		console.log(this.querySelector("#a2f-bt-modal"));
		btModal = this.querySelector("#a2f-bt-modal");
		btModal.click();
    }
}

const content = async(username) => {/*html*/`
	<button id="a2f-bt-modal" style="display: none;" data-bs-toggle="modal" data-bs-target="#a2f-modal"></button>
	<div class="modal fade" id="a2f-modal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5">${username}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
				coucou
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary">Save changes</button>
				</div>
			</div>
		</div>
	</div>
`};
