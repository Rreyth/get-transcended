import { Component } from "../../js/component.js";

export class Login extends Component {
    static getName() {
        return "login";
    }

    connectedCallback() {
		this.innerHTML = content;
    }
}

const content = /*html*/`
	<div class="align-self-center" id="sing-in-form">
		<div class="form-group flex-column d-flex row-gap-5">
			<div class="flex-column d-flex row-gap-4">
				<input class="form-control" type="text" placeholder="Username">
				<input class="form-control" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary">Log In</button>
		</div>
	</div>
`;
