import { router } from "./main.js";

async function get_reponce(page) {
	try{
		let ftch = await fetch(page);
	}
	catch (error) {
		console.error('Error login:', error);
	}
}

document.addEventListener("DOMContentLoaded", async e => {
	document.addEventListener('submit', e => {
		e.preventDefault();
		const loginForm = document.getElementById("login-form");
		const formData = new FormData(loginForm);
		formData.forEach(entry => {
			console.log(entry);
		});

		fetch ('/login/', {
			method: 'POST',
			body: formData,
			headers: {
				'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
			},
		})
		.then(response => response.json())
		.then(data => {
			if (data.status == 'success'){
				alert(data.message);
				//window.history.pushState(null, null, "https://localhost:44433/home");
				//window.history.replaceState(null, null, "https://localhost:44433/home");
				//router();
			}
			else {
				alert(data.message);
			}
		})
		.catch(error => {
			console.log(error);
			console.error('An error occured: ', error);
		});
	});
})
