import { Component } from "../../js/component.js";

export class SSign extends Component {
    static getName() {
        return "ssign";
    }

    async connectedCallback() {
		this.innerHTML = content;

		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		console.log(code);
		if (code)
		{
			const url = `https://${location.hostname}:${location.port}/api/42?code=${code}`;
			
			
			let requestOptions = {
					method: 'GET',
					redirect: 'follow',
				};
		
			const response = await fetch(url, requestOptions);
			const res = (await response.json());
			if (res.access)
			{
				cookieStore.set({name: 'token', value: res.access});
				location.href = location.href.split('?')[0];
			}
		}

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
		this.addClickEvent('#sing-42-switch', async (e) => {
			// const response = await fetch("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2ffd2ebbe228c94c5e8db5210490bb337c5b1ce0a919b151c5b5862f402b5ac4&redirect_uri=https%3A%2F%2Flocalhost%3A44433%2F&response_type=code");
			// console.log(response);
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

		<a class="d-flex" id="sing-42-switch" style="cursor: pointer;" href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b5e0cf73ba0e68a7e2bc9e5fa86d0f242be05def4e3de852c9e804e95b398350&redirect_uri=https%3A%2F%2Flocalhost%3A44433%2F&response_type=code">
			<div class="d-flex flex-row align-items-center gap-2 fs-3">
				<div class="d-flex justify-center align-items-center rounded-circle bg-secondary p-2">
					<!-- <i class='bx bx-user bx-lg'></i> --->
					<img src="/media/42_logo.svg" style="height: 1.8em; width: 1.8em;">
				</div>
				<span>42 Sign in</span>
			</div>
		</a>
	</div>
`;
