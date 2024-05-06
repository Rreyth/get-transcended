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

			<div class="d-flex align-self-center justify-center align-items-center rounded-circle bg-secondary p-2" style="width: 10em; height: 10em;">
				<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 24 24" style="fill: rgba(210, 210, 210, 1);msFilter:;"><path d="M12 2c-4.963 0-9 4.038-9 9v8h.051c.245 1.691 1.69 3 3.449 3 1.174 0 2.074-.417 2.672-1.174a3.99 3.99 0 0 0 5.668-.014c.601.762 1.504 1.188 2.66 1.188 1.93 0 3.5-1.57 3.5-3.5V11c0-4.962-4.037-9-9-9zm7 16.5c0 .827-.673 1.5-1.5 1.5-.449 0-1.5 0-1.5-2v-1h-2v1c0 1.103-.897 2-2 2s-2-.897-2-2v-1H8v1c0 1.845-.774 2-1.5 2-.827 0-1.5-.673-1.5-1.5V11c0-3.86 3.141-7 7-7s7 3.14 7 7v7.5z"></path><circle cx="9" cy="10" r="2"></circle><circle cx="15" cy="10" r="2"></circle></svg>
				<div class="position-absolute d-flex justify-content-center align-items-center rounded-circle bg-danger" style="transform: translate(600%, 270%); width: 1.3em; height: 1.3em;">
					<i class='bx bx-plus bx-sm' style="transform: translate(1%, 4%);"></i>
				</div>
				</div>

			<div class="flex-column d-flex row-gap-4">
				<input class="form-control" type="text" placeholder="Username">
				<input class="form-control" type="email" placeholder="Email">
				<input class="form-control" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary">Sing up</button>
		</div>
	</div>
`;