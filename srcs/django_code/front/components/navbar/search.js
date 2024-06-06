import { Component } from "../../js/component.js";
import { user, translate, user_token, api } from "../../js/helpers.js";

export class Search extends Component {
    static getName() {
        return "search";
    }


	async connectedCallback() {
		super.connectedCallback();
		if (await user() != null) {
			let token = await user_token();
			let attrContent = this.getAttribute('content');


			if (this.getAttribute('content') === "")
				this.innerHTML = await emptySearch();
			else {
				let response = await api("/user/search/?username_prefix=" + attrContent, "GET", null, token);
				response = (await response.json());

				this.innerHTML = /* html */ `
					<div class="w-100 h-100 d-flex align-items-center flex-column overflow-auto">
						${response.map(item => { return createUserCard("frank.svg", item) }).join('')}
					</div>
					<style>
						.user-search-card:hover
						{
							border-color: blue;
						}
					</style>
				`;
			}
		}
	}

}

function createUserCard(imgName, name)
{
	return ( /* html */`
		<div class="card mb-3 h-25 my-2 user-search-card" style="width: 80%;">
			<div class="row g-0">
				<div class="col-md-4">
					<img src="/media/${imgName}" class="img-fluid rounded-start" alt="...">
				</div>
				<div class="col-md-8">
					<div class="card-body d-flex align-items-center justify-content-center" style="height: 67%;">
						<span class="text-truncate" style="font-size: 1.5em;">${name}</span>
					</div>
					<div class="d-flex align-items-start justify-content-evenly btns btns-${name}" style="height: 33%;">
						<i class='bx bxs-user-detail rounded-circle bg-light border border-dark p-1' id="bt-profile" style="cursor: pointer;"></i>
						<i class='bx bx-user-plus rounded-circle bg-light border border-dark p-1' style="cursor: pointer;"></i>
						<i class='bx bx-message-dots rounded-circle bg-light border border-dark p-1' style="cursor: pointer;"></i>
						<i class='bx bx-joystick rounded-circle bg-light border border-dark p-1' style="cursor: pointer;"></i>
					</div>
				</div>
			</div>
		</div>
	`);
}

const emptySearch = async () =>/* html */ `
	<div class="w-100 h-100 d-flex justify-content-center align-items-center">
		<i class='bx bx-search-alt bx-lg' ></i>
		<span style="font-size: 1.5em; margin-left: 1em; width: 60%">${await translate("nav.rshUser")}</span>
	</div>
`;
