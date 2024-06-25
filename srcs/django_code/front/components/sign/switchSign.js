import { Component } from "../../js/component.js";
import { APIRequest, translate } from "../../js/helpers.js";

export class SSign extends Component {
    static getName() {
        return "ssign";
    }

    async connectedCallback() {
		this.innerHTML = content;

		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		if (code)
		{
			// const url = `https://${location.hostname}:${location.port}/api/42?code=${code}`;

			// const response = await fetch(url);
			const response = await APIRequest.build(`/42?code=${code}`, 'GET').send();
			const res = (await response.json());
			if (res.access)
			{
				cookieStore.set({name: 'token', value: res.access});
				location.href = location.href.split('?')[0];
			}
			else
			{
				document.querySelector(".error-box").innerHTML = /*html*/`
					<div class="alert position-absolute top-0 w-100 alert-warning alert-dismissible d-flex" role="alert">
						<i class='bx bx-error-alt bx-sm' style="margin-right: 0.4em;"></i>
						<span id="api-error-txt"></span>
						<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
					</div>
				`;
				if (res.username)
					document.getElementById("api-error-txt").innerHTML = "All occurence of your 42login is already used, please register manually";
				else if (res.email)
					document.getElementById("api-error-txt").innerHTML = "Email already exist, try manually connexion";
				else if (res.apiError)
					document.getElementById("api-error-txt").innerHTML = "API Error, please try later";
				else
					document.getElementById("api-error-txt").innerHTML = "Error, please try later";

			}
		}

		this.addClickEvent('#sing-in-switch', (e) => {
			if (document.getElementById("singup-tag") != null)
			{
				document.getElementById("singup-tag").remove();
				document.getElementById("signs").innerHTML += `<c-login id="singin-tag"></c-login>`;
			}
		})
		this.addClickEvent('#sing-up-switch', (e) => {
			if (document.getElementById("singin-tag") != null)
			{
            	document.getElementById("singin-tag").remove();
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
				<span>${ await translate("forms.log_in") }</span>
			</div>
		</div>

		<div class="d-flex" id="sing-up-switch" style="cursor: pointer;">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<i class='bx bx-user-plus bx-lg'></i>
				</div>
				<span>${ await translate("forms.sign_up") }</span>
			</div>
		</div>

		<hr />

		<a class="d-flex text-decoration-none text-reset" href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-75a7d436e9402c12a2fb544a8545365a7e2c22ade0e4f9bbb1e9931c22c2cb5c&redirect_uri=https%3A%2F%2Flocalhost%3A44433%2Flogin&response_type=code">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<img src="/media/42_logo.svg" style="height: 1.8em; width: 1.8em;">
				</div>
				<span>${ await translate("forms.42sign_in") }</span>
			</div>
		</a>
	</div>
`;
