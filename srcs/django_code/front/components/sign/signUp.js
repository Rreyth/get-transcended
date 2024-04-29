import { Component } from "../../js/component.js";

export class SignUp extends Component {
    static getName() {
        return "signup";
    }

    connectedCallback() {
		this.innerHTML = content;
    }
}

const content = /*html*/`
	<div class="d-flex align-items-center justify-content-center" id="sing-up-form">
		<div class="form-group flex-column d-flex row-gap-5">
			<div class="flex-column d-flex row-gap-4">
				<input class="form-control" type="text" placeholder="Username">
				<input class="form-control" type="email" placeholder="Email">
				<input class="form-control" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary">Sing up</button>
		</div>
	</div>
`;
