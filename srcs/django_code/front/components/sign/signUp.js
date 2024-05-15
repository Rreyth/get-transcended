import { Component } from "../../js/component.js";

export class SignUp extends Component {
    static getName() {
        return "signup";
    }

    connectedCallback() {
		this.innerHTML = content;
		const popover_container = document.querySelector("#popover-container");
		const dropdownMenu = document.getElementById('dropdownMenu');
		const inputEmail = this.querySelector("#input-email");
		const inputPass = this.querySelector("#input-pass");

		this.querySelector("#input-user").addEventListener("input", (e) => {
			if (e.target.value.length > lengthUserMax)
			{
				this.querySelector("#input-user").style.color = "#a51221";
				if (this.querySelector(".popover-user") === null)
				{
					const popover = new bootstrap.Popover(e.target, {
						container: popover_container,
						content: "Le nom d'utilisateur ne peux pas depasser 10 charactere",
						placement: "right",
						trigger: "manual",
						boundary: "viewport",
						customClass: "popover-user"
					  });
					  popover.show();
				}
			}
			else
			{
				this.querySelector("#input-user").style.color = "black";
				popover_container.innerHTML = "";
			}
		})
		this.querySelector("#input-user").addEventListener("blur", (e) => {
			const responseUser = "requetteDB";
			if (responseUser === e.target.value)
			{
				this.querySelector("#input-user").style.color = "#a51221";
				if (this.querySelector(".popover-user") === null)
				{
					const popover = new bootstrap.Popover(e.target, {
						container: popover_container,
						content: "Le nom d'utilisateur existe deja",
						placement: "right",
						trigger: "manual",
						boundary: "viewport",
						customClass: "popover-user"
					  });
					  popover.show();
				}
			}
			else if (e.target.value.length <= lengthUserMax)
			{
				popover_container.innerHTML = "";
			}
		})
		this.querySelector("#input-user").addEventListener("focus", (e) => {
			popover_container.innerHTML = "";
		})


		inputEmail.addEventListener("input", (e) => {
			const inputEmail = document.getElementById('input-email');
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
			{
				dropdownMenu.classList.remove('show');
			}
			
		})

		dropdownMenu.addEventListener('click', (e) => {
			e.preventDefault();

			if (e.target.classList.contains('dropdown-item'))
			{
				inputEmail.value = e.target.innerHTML;
				dropdownMenu.classList.remove('show');
				if (emailIsAlreadyUsed(inputEmail.value))
				{
					inputEmail.style.color = '#a51221';
					
					if (this.querySelector(".popover-email") === null)
					{
						const popover = new bootstrap.Popover(inputEmail, {
							container: popover_container,
							content: "Le nom d'utilisateur existe deja",
							placement: "right",
							trigger: "manual",
							boundary: "viewport",
							customClass: "popover-email"
						});
						popover.show();
					}

				}
			}
		});

		inputEmail.addEventListener("blur", (e) => {
			if (emailIsAlreadyUsed(inputEmail.value))
			{
				inputEmail.style.color = '#a51221';
				
				if (this.querySelector(".popover-email") === null)
				{
					const popover = new bootstrap.Popover(inputEmail, {
						container: popover_container,
						content: "Le nom d'utilisateur existe deja",
						placement: "right",
						trigger: "manual",
						boundary: "viewport",
						customClass: "popover-email"
					});
					popover.show();
				}

			}
			else
			{
				inputEmail.style.color = 'black';
				if (this.querySelector(".popover-email") != null)
				{
					this.querySelector(".popover-email").remove();
				}
			}
		});

		inputPass.addEventListener("input", (e) => {
			const passwordIsGood = passwordCheck(e.target.value);

			if (passwordIsGood.includes(false))
			{
				inputPass.style.color = "#a51221";
				if (this.querySelector(".popover-pass") === null)
				{
					const popover = new bootstrap.Popover(inputPass, {
						container: popover_container,
						content: "f",
						placement: "right",
						trigger: "manual",
						boundary: "viewport",
						customClass: "popover-pass"
					});
					popover.show();
				}
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
			{
				inputPass.style.color = "black";
				if (this.querySelector(".popover-pass") != null)
				{
					this.querySelector(".popover-pass").remove();
				}
			}
		});

    }
}

const passPopoverContent = /* html */ `
	<p id="passContent1">doit contenir une maj</p>
	<p id="passContent2">doit contenir une min</p>
	<p id="passContent3">doit contenir un nombre</p>
	<p id="passContent4">doit etre >=8</p>

`;

function setPopoverContent (className, newContent)
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

function emailIsAlreadyUsed (tryEmail) {

	const responseUser = true;

	if (tryEmail === "swotex@gmail.com")
		return (true);
	else
		return (false);

	return (responseUser);
}


const lengthUserMax = 10;

const content = /*html*/`
	<div class="d-flex align-self-center" id="sing-up-form">
		<div class="form-group flex-column d-flex row-gap-5">

			<div class="d-flex align-self-center justify-center align-items-center rounded-circle bg-secondary p-2" style="width: 10em; height: 10em;">
				<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 24 24" style="fill: rgba(210, 210, 210, 1);msFilter:;"><path d="M12 2c-4.963 0-9 4.038-9 9v8h.051c.245 1.691 1.69 3 3.449 3 1.174 0 2.074-.417 2.672-1.174a3.99 3.99 0 0 0 5.668-.014c.601.762 1.504 1.188 2.66 1.188 1.93 0 3.5-1.57 3.5-3.5V11c0-4.962-4.037-9-9-9zm7 16.5c0 .827-.673 1.5-1.5 1.5-.449 0-1.5 0-1.5-2v-1h-2v1c0 1.103-.897 2-2 2s-2-.897-2-2v-1H8v1c0 1.845-.774 2-1.5 2-.827 0-1.5-.673-1.5-1.5V11c0-3.86 3.141-7 7-7s7 3.14 7 7v7.5z"></path><circle cx="9" cy="10" r="2"></circle><circle cx="15" cy="10" r="2"></circle></svg>
				<div class="position-absolute d-flex justify-content-center align-items-center rounded-circle bg-danger" style="transform: translate(600%, 270%); width: 1.3em; height: 1.3em;">
					<i class='bx bx-plus bx-sm' style="transform: translate(1%, 4%);"></i>
				</div>
				</div>

			<div class="flex-column d-flex row-gap-4">
				<input class="form-control" id="input-user" type="text" placeholder="Username">
				<input class="form-control" id="input-email" type="email" placeholder="Email">
				<div class="dropdown-menu" id="dropdownMenu">
					<!-- Contenu du dropdown -->
				</div>
				<input class="form-control" id="input-pass" type="password" placeholder="Password">
			</div>
			<button type="button" class="btn btn-primary">Sing up</button>
		</div>
		</div>
		<div class="red-popover" id="popover-container"></div>
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
