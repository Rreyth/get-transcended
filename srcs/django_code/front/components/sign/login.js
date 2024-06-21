import { MyRouter } from "../../js/MyRouter.js";
import { Component } from "../../js/component.js";
import { auth } from "../../js/helpers.js";

export class Login extends Component {
    static getName() {
        return "login";
    }

    connectedCallback() {
		this.innerHTML = content;
		const inputUser = this.querySelector("#input-user");
		const inputPass = this.querySelector("#input-pass");

		this.querySelector("#signin-btn").addEventListener("click", (e) => {
			connect(inputUser.value, inputPass.value);
		})
		this.addEventListener('keydown', (e) => {
			if (e.key === 'Enter')
				connect(inputUser.value, inputPass.value);
		})


    }
}

async function connect(username, password)
{
	const response = await auth(username, password);
	if (response) {
		MyRouter.push("/");
		window.dispatchEvent(new Event("refreshUser"));
	}
	else
		document.querySelector("#alert-id").classList.add("show");
}

const content = /*html*/`
	<div class="align-self-center" id="sing-in-form">
		<div class="form-group flex-column d-flex row-gap-5">
			<div class="d-flex align-self-center justify-content-center align-items-center rounded-circle bg-secondary p-2" style="width: 10em; height: 10em;">
				<img class="rounded-circle" src="/media/frank.svg" style="width: 10em; height: 10em;" />
			</div>
			<div class="flex-column d-flex row-gap-4">
				<div class="alert alert-danger collapse" id="alert-id" role="alert">
					Password or user is wrong
				</div>
				<input class="form-control" id="input-user" type="text" placeholder="Username">
				<input class="form-control" id="input-pass" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary" id="signin-btn">Log In</button>
		</div>
	</div>
`;
