import { Component } from "../../js/component.js";

export class SSign extends Component {
    static getName() {
        return "ssign";
    }

    connectedCallback() {
		this.innerHTML = content;

		this.addClickEvent('#sing-in-switch', (e) => {
			if (document.getElementById("singup-tag") != null)
			{
				document.getElementById("singup-tag").remove();
				// document.body.innerHTML += `<c-login id="singin-tag"></c-login>`;
				document.getElementById("signs").innerHTML += `<c-login id="singin-tag"></c-login>`;
			}
		})
		this.addClickEvent('#sing-up-switch', (e) => {
			if (document.getElementById("singin-tag") != null)
			{
            	document.getElementById("singin-tag").remove();
				// document.body.innerHTML += `<c-signup id="singup-tag"></c-signup>`;
				document.getElementById("signs").innerHTML += `<c-signup id="singup-tag"></c-signup>`;
			}
        })
    }
}

const content = /*html*/`
	<div class="d-flex flex-column position-absolute fixed-bottom row-gap-3 ms-4 mb-4" style="width: 14em;">
		<div class="d-flex" id="sing-in-switch" style="cursor: pointer;">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<i class='bx bx-log-in bx-lg'></i>
				</div>
				<span>Sign in</span>
			</div>
		</div>

		<div class="d-flex" id="sing-up-switch" style="cursor: pointer;">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<i class='bx bx-user-plus bx-lg'></i>
				</div>
				<span>Sign up</span>
			</div>
		</div>

		<hr />

		<div class="d-flex" style="cursor: pointer;">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<!-- <i class='bx bx-user bx-lg'></i> --->
					<img src="/media/42_logo.svg" style="height: 1.8em; width: 1.8em;">
				</div>
				<span>42 Sign in</span>
			</div>
		</div>
	</div>
`;
