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
	const loginForm = document.getElementById('login-form');

	document.addEventListener('submit', e => {
		e.preventDefault();

		cpons
		const formData = new FormData();
		//formData.append(loginForm.value)

		fetch ('/login/', {
			method: 'POST',
			body: formData,
			headers: {
				'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
			},
		})
		.then(response => response.json())
		.then(data => {
			if (data.status == 'succes'){
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
			console.error('An error occured: ', error);
		});
	});
})




	//e.preventDefault();
	//const username = document.querySelector("input[name=username]").value;
	//const password = document.querySelector("input[type=password]").value;
	//console.log(username);
	//console.log(password);

	//let Json_responce = get_reponce();
	//console.log(Json_responce);

	//window.history.pushState(null, null, "https://localhost:44433/home");
	//window.history.replaceState(null, null, "https://localhost:44433/home");
	//router();
