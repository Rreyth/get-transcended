import { Component } from "../../js/component.js";

export class SSign extends Component {
    static getName() {
        return "ssign";
    }

    connectedCallback() {
		this.innerHTML = content;

		this.addClickEvent('#sing-in-switch', (e) => {
			if (document.getElementById("singin-tag") != null)
			{
            	document.getElementById("singin-tag").remove();
				document.body.innerHTML += `<c-signup id="singup-tag"></c-signup>`;
			}
        })
		this.addClickEvent('#sing-up-switch', (e) => {
			if (document.getElementById("singup-tag") != null)
			{
            	document.getElementById("singup-tag").remove();
				document.body.innerHTML += `<c-login id="singin-tag"></c-login>`;
			}
        })
    }
}

const content = /*html*/`
	<div class="d-flex flex-column position-absolute fixed-bottom row-gap-3 ms-4 mb-4" style="width: 14em;">
		<div class="d-flex" id="sing-in-switch" style="background-color: red;">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<i class='bx bx-user bx-lg'></i>
				</div>
				<a>Sign in</a>
			</div>
		</div>

		<div class="d-flex" id="sing-up-switch">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<i class='bx bx-user bx-lg'></i>
				</div>
				<a>Sign up</a>
			</div>
		</div>

		<hr />

		<div class="d-flex">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<i class='bx bx-user bx-lg'></i>
				</div>
				<a>42 Sign in</a>
			</div>
		</div>
	</div>
`;
