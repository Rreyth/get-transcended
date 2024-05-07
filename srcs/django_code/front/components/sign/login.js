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
	<div class="d-flex align-self-center justify-center align-items-center rounded-circle bg-secondary p-2" style="width: 10em; height: 10em;">
		<!--- <i class='bx bx-ghost bx-lg'></i> --->
		<!--- <img src="data:image/png;base64,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"/> --->
		<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 24 24" style="fill: rgba(210, 210, 210, 1);transform: ;msFilter:;"><path d="M12 2c-4.963 0-9 4.038-9 9v8h.051c.245 1.691 1.69 3 3.449 3 1.174 0 2.074-.417 2.672-1.174a3.99 3.99 0 0 0 5.668-.014c.601.762 1.504 1.188 2.66 1.188 1.93 0 3.5-1.57 3.5-3.5V11c0-4.962-4.037-9-9-9zm7 16.5c0 .827-.673 1.5-1.5 1.5-.449 0-1.5 0-1.5-2v-1h-2v1c0 1.103-.897 2-2 2s-2-.897-2-2v-1H8v1c0 1.845-.774 2-1.5 2-.827 0-1.5-.673-1.5-1.5V11c0-3.86 3.141-7 7-7s7 3.14 7 7v7.5z"></path><circle cx="9" cy="10" r="2"></circle><circle cx="15" cy="10" r="2"></circle></svg>
	</div>
	<div class="flex-column d-flex row-gap-4">
				<input class="form-control" type="text" placeholder="Username">
				<input class="form-control" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary">Log In</button>
		</div>
	</div>
`;
