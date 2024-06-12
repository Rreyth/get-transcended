import { Component } from "../../js/component.js";
import { APIRequest } from "../../js/helpers.js"

export class SignUp extends Component {
    static getName() {
        return "signup";
    }

    connectedCallback() {
		this.innerHTML = content;
		const dropdownMenu = document.getElementById('dropdownMenu');
		const inputEmail = this.querySelector("#input-email");
		const inputPass = this.querySelector("#input-pass");
		const inputUser = this.querySelector("#input-user");
		const imgBtn = this.querySelector("#addimg-btn");
		let file;

		inputUser.addEventListener("input", (e) => {
			if (e.target.value.length > lengthUserMax)
			{
				this.querySelector("#input-user").style.color = "#a51221";
				createPopover(e.target, "popover-user", "Le nom d'utilisateur ne peux pas depasser 10 charactere");
			}
			else
				removeError(inputUser, "popover-user");
		})

		inputEmail.addEventListener("input", (e) => {
			const inputRect = inputEmail.getBoundingClientRect();
			dropdownMenu.style.top = (inputRect.top + inputRect.height) + 'px';
			if (e.target.value.includes("@") === false && e.target.value != "")
			{
				dropdownMenu.innerHTML = `
					<span class="dropdown-item">${e.target.value}@gmail.com</span>
					<span class="dropdown-item">${e.target.value}@hotmail.com</span>
					<span class="dropdown-item">${e.target.value}@orange.fr</span>
				`;
				dropdownMenu.classList.add('show');
			}
			else
				dropdownMenu.classList.remove('show');
			
		})

		dropdownMenu.addEventListener('mousedown', (e) => {
			e.preventDefault();
			
			if (e.target.classList.contains('dropdown-item'))
			{
				inputEmail.value = e.target.innerHTML;
				dropdownMenu.classList.remove('show');
			}
		});

		inputEmail.addEventListener("blur", (e) => {
				dropdownMenu.classList.remove('show');
				if (!emailIsValid(inputEmail.value) && inputEmail.value != "")
				{
					inputEmail.style.color = '#a51221';
					createPopover(inputEmail, "popover-email", "mal formater");
				}
				else
					removeError(inputEmail, "popover-email");
		});
		
		inputEmail.addEventListener("focus", (e) => {
			if (e.target.value.includes("@") === false && e.target.value != "")
				dropdownMenu.classList.add('show');
		});

		inputPass.addEventListener("input", (e) => {
			const passwordIsGood = passwordCheck(e.target.value);

			if (passwordIsGood.includes(false) && e.target.value != "")
			{
				inputPass.style.color = "#a51221";
				createPopover(inputPass, "popover-pass", "none");
				setPopoverContent("popover-pass", passPopoverContent);
				if (passwordIsGood[0] == true)
					this.querySelector("#passContent1").style.color = "green";
				if (passwordIsGood[1] == true)
					this.querySelector("#passContent2").style.color = "green";
				if (passwordIsGood[2] == true)
					this.querySelector("#passContent3").style.color = "green";
				if (passwordIsGood[3] == true)
					this.querySelector("#passContent4").style.color = "green";
			}
			else
				removeError(inputPass, "popover-pass");
		});
		
		imgBtn.addEventListener("click", (e) => {
			document.getElementById('fileInput').click();
		})

		document.getElementById('fileInput').onchange = evt =>
		{
			document.getElementById("profile-img").src = "/media/frank.svg";
			file = document.getElementById('fileInput').files[0];
			if (file)
			{
				document.getElementById("profile-img").src = URL.createObjectURL(file);
			}
		}

		this.querySelector("#singup-btn").addEventListener("click", async (e) => {
			registerUser(inputUser.value, inputEmail.value,inputPass.value, file);
		});
		this.addEventListener('keydown', (e) => {
			if (e.key === 'Enter')
				registerUser(inputUser.value, inputEmail.value,inputPass.value, file);
		})
    }
}


const passPopoverContent = /* html */ `
	<p id="passContent1">doit contenir une maj</p>
	<p id="passContent2">doit contenir une min</p>
	<p id="passContent3">doit contenir un nombre</p>
	<p id="passContent4">doit etre >=8</p>

`;

async function registerUser(username, email, password, file)
{
	if (!emailIsValid(email))
		return;
	else if (passwordCheck(password).includes(false))
		return;
	else if (username.length > lengthUserMax)
		return;

	const data = new FormData();
	data.append("username", username);
	data.append("email", email);
	data.append("password", password);
	if (file)
		data.append("avatar", file);
	const response = await APIRequest.build("/register/", "POST").setBody(data).send();
	const res = (await response.json());
	if (res.username || res.email || res.avatar)
	{
		document.querySelector("#alert-id").innerHTML = "";

		if (res.username)
			document.querySelector("#alert-id").innerHTML += "<span>username is already used</span>";
		if (res.email)
			document.querySelector("#alert-id").innerHTML += "<span>email is already used</span>";
		if (res.avatar)
			document.querySelector("#alert-id").innerHTML += "<span>bad image input</span>";
		document.querySelector("#alert-id").classList.add("show");
	}
	else if (res.access)
	{
		document.querySelector("#alert-id").classList.remove("show");
		cookieStore.set({name: 'token', value: res.access});
		location.reload();
	}
	else
	{
		document.querySelector("#alert-id").innerHTML = "Internal error, try later";
		document.querySelector("#alert-id").classList.add("show");
	}
}

function removeError(input, popover)
{
	input.style.color = "black";
	const selectPopover = document.querySelector(`.${popover}`);
	if (selectPopover != null)
	{
		selectPopover.remove();
	}
}

function createPopover(target, name, content)
{
	if (document.querySelector(`.${name}`) === null)
	{

	const popover_container = document.querySelector("#popover-container");
	const popover = new bootstrap.Popover(target, {
		container: popover_container,
		content: content,
		placement: "right",
		trigger: "manual",
		boundary: "viewport",
		customClass: name
	});
	popover.show();
	}
}

function setPopoverContent(className, newContent)
{
	const popoverElement = document.querySelector('.' + className);
    if (popoverElement)
	{
      const popoverBody = popoverElement.querySelector('.popover-body');
      if (popoverBody)
	  {
        popoverBody.innerHTML = newContent;
      }
    }
}

function emailIsValid(email)
{
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return (emailRegex.test(email))
}

function passwordCheck(password)
{
	let errorTest = [true, true, true, true];

	if ((/[A-Z]/.test(password)) === false)
		errorTest[0] = false;
	if ((/[a-z]/.test(password)) === false)
		errorTest[1] = false;
	if ((/[0-9]/.test(password)) === false)
		errorTest[2] = false;
	if (password.length < 8)
		errorTest[3] = false;

	return (errorTest);
}


const lengthUserMax = 10;

const content = /*html*/`
	<div class="d-flex align-self-center" id="sing-up-form">
		<div class="form-group flex-column d-flex row-gap-5">

			<div class="position-relative d-flex align-self-center justify-content-center align-items-center rounded-circle bg-secondary p-2" id="addimg-btn" style="width: 10em; height: 10em; cursor:pointer;">
				<div>
					<img class="rounded-circle" id="profile-img" src="/media/frank.svg" style="width: 10em; height: 10em; object-fit: cover; object-position: center;" />
				</div>
				<div class="position-absolute d-flex justify-content-center align-items-center rounded-circle bg-primary p-1" style="right:0.3em; bottom:0.3em;">
					<i class='bx bx-plus bx-sm' style="transform: translate(1%, 4%);"></i>
				</div>
				</div>

			<div class="flex-column d-flex row-gap-4">
				<div class="alert alert-danger row collapse" id="alert-id" role="alert">
					error msg
				</div>
				<input class="form-control" id="input-user" type="text" placeholder="Username">
				<input class="form-control" id="input-email" type="email" placeholder="Email">
				<div class="dropdown-menu" id="dropdownMenu">
					<!-- Contenu du dropdown -->
				</div>
				<input class="form-control" id="input-pass" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary" id="singup-btn">Sing up</button>
		</div>
		</div>
		<div class="red-popover" id="popover-container"></div>
		<input type="file" id="fileInput" name="profile_picture" accept="image/*" style="display: none;" />
	<style>
    /* Style CSS pour le Popover rouge */
    .red-popover .popover {
        //background-color: #f8d7da27;
        border-color: #f5c6cb;
    }
	.red-popover .popover-body
	{
		color: #721c24;
	}
	.red-popover {
		filter: drop-shadow(1px 0px 0px #f8d7da)
        drop-shadow(-1px 0px 0px #f8d7da)
        drop-shadow(0px 1px 0px #f8d7da)
        drop-shadow(0px -1px 0px #f8d7da)
        drop-shadow(1px 1px 0px #f8d7da)
        drop-shadow(-1px -1px 0px #f8d7da)
        drop-shadow(-1px 1px 0px #f8d7da)
        drop-shadow(1px -1px 0px #f8d7da)
    }
</style>
`;
