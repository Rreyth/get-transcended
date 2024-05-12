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
			else
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
			dropdownMenu.innerHTML = `
				<span class="dropdown-item">${e.target.value}@gmail.com</span>
				<span class="dropdown-item">${e.target.value}@hotmail.com</span>
				<span class="dropdown-item">${e.target.value}@orange.fr</span>
			`;

			dropdownMenu.classList.add('show');
			
		})

			dropdownMenu.addEventListener('click', (e) => {
			  e.preventDefault();

			  if (e.target.classList.contains('dropdown-item'))
			  {
				console.log(e.target);
				inputEmail.value = e.target.innerHTML;
				dropdownMenu.classList.remove('show');
				if (emailIsAlreadyUsed(inputEmail.value))
				{
					inputEmail.style.color = '#a51221';
					
					if (this.querySelector(".popover-user") === null)
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


    }
}

function emailIsAlreadyUsed (tryEmail) {
	const responseUser = true;

	return (responseUser);
}

// function createPopover (target, content)
// {
// 	const popover_container = document.querySelector("#popover-container");
// 	let popover = new bootstrap.Popover(target, {
// 		container: popover_container,
// 		content: content,
// 		placement: "right",
// 		trigger: "manual",
// 		boundary: "viewport",
// 		customClass: "popover-user"
// 	  });
// 	  return (popover);
// }

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
					<a class="dropdown-item" href="#">Option 1</a>
					<a class="dropdown-item" href="#">Option 2</a>
					<a class="dropdown-item" href="#">Option 3</a>
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
