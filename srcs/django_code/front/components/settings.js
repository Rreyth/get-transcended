import { Component } from "../../js/component.js";

export class Settings extends Component {
    static getName() {
        return "settings";
    }

    async connectedCallback() {
		this.innerHTML = content;

    }
}

const content = /*html*/`
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
									<img class="rounded-4" id="profile-img" src="/profile/giphy.gif" style="width: 6em; height: 6em;" />
									<div class="d-flex flex-column align-items-start ms-3">
										<span style="font-size: 1.3em;">Profile picture</span>
										<span style="font-size: 0.8em; margin-bottom: 0.4em; color: grey;">jpg - png - gif</span>
										<button type="button" class="btn btn-outline-secondary">Upload</button>
									</div>
								</div>
							</div>
							<div class="col-md-auto d-flex flex-column justify-content-center align-items-center mx-2 my-2">
								<span>Auth A2F</span>
								<div class="form-check form-switch">
									<input class="form-check-input" type="checkbox" role="switch" checked>
								</div>
							</div>

						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3 mt-5">
							<input class="form-control mx-2" type="text" placeholder="Username">
						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3">
							<input class="form-control mx-2" type="email" placeholder="Email">
						</div>

						<div class="col-md d-flex justify-content-center align-items-center my-3">
							<input class="form-control mx-2" type="password" placeholder="New password">
						</div>

					</div>
				</div>

				<div class="modal-footer justify-content-between">
					<div class="d-flex">
						<input class="form-control mx-2" type="password" placeholder="Current password">
					</div>
					<div>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary" disabled>Save</button>
					</div>
				</div>
				
			</div>
		</div>
	</div>
`;
