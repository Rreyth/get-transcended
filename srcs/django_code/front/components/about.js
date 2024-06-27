import { Component } from "../js/component.js";
import { translate } from "../js/helpers.js"

export class About extends Component {
	static getName() {
		return "about";
    }

    async connectedCallback() {
		this.innerHTML = await content();

		const aboutContainer = this.querySelector("#about-container");

		dragElement(aboutContainer);

		function dragElement(elmnt) {
			let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
			if (document.getElementById("about-header"))
			{
				document.getElementById("about-header").onmousedown = dragMouseDown;
			}
			else
			{
				elmnt.onmousedown = dragMouseDown;
			}

			function dragMouseDown(e)
			{
				e.preventDefault();
				pos3 = e.clientX;
				pos4 = e.clientY;
				document.onmouseup = closeDragElement;
				document.onmousemove = elementDrag;
			}

			function elementDrag(e)
			{
				e = e || window.event;
				e.preventDefault();
				pos1 = pos3 - e.clientX;
				pos2 = pos4 - e.clientY;
				pos3 = e.clientX;
				pos4 = e.clientY;
				elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
			}

			function closeDragElement()
			{
				document.onmouseup = null;
				document.onmousemove = null;
			}
		}

		this.querySelector("#close-about").onclick = () => {
			aboutContainer.style.display = "none";
		}
    }
}

const content = async () => /*html*/`
	<div id="about-container" class="bg-dark">
		<div class="d-flex align-items-center bg-body-secondary" id="about-header">
			<span class="flex-grow-1 text-center">${ await translate("about.about_us") }</span>
			<i class='bx bx-x bx-md' style="cursor: pointer;" id="close-about"></i>
		</div>
		<div class="row mx-1 my-2 user-select-none">

			<div class="col d-flex flex-column align-items-center mx-1 rounded-3 card border-light">
				<div>
					<img class="rounded-4 mt-3" src="https://cdn.intra.42.fr/users/bc8f6250a88ae6316c4207e18fb99776/ltuffery.jpg" style="width: 7em; height: 7em; object-fit: cover; object-position: center;"/>
				</div>
				<span class="mt-2" style="font-size: 1.8em;">ltuffery</span>
				<span class="align-self-start mt-3" style="font-size: 1.3em;">${ await translate("about.about") } :</span>
				<p class="mt-1">${ await translate("about.42_stud") }</p>
				<div class="d-flex justify-content-evenly w-100 mb-3">
					<a href="https://github.com/ltuffery" class='bx bxl-github bx-sm text-decoration-none text-reset'></a>
					<a href="https://fr.linkedin.com/in/leo-tuffery-1399b12b0" class='bx bxl-linkedin-square bx-sm text-decoration-none text-reset'></a>
					<a href="mailto:contact@xn--lo-bja.dev" class='bx bx-mail-send bx-sm text-decoration-none text-reset'></a>
				</div>
			</div>

			<div class="col d-flex flex-column align-items-center mx-1 rounded-3 card border-light">
				<div>
					<img class="rounded-4 mt-3" src="https://cdn.intra.42.fr/users/39294f3af6fdff159c137a24f6639c9f/tdhaussy.jpg" style="width: 7em; height: 7em; object-fit: cover; object-position: center;"/>
				</div>
				<span class="mt-2" style="font-size: 1.8em;">tdhaussy</span>
				<span class="align-self-start mt-3" style="font-size: 1.3em;">${ await translate("about.about") } :</span>
				<p class="mt-1">${ await translate("about.42_stud") }</p>
				<div class="d-flex justify-content-evenly w-100 mb-3">
					<a href="https://github.com/Rreyth" class='bx bxl-github bx-sm text-decoration-none text-reset'></a>
					<a href="https://fr.linkedin.com/in/terry-dhaussy-3a0617158" class='bx bxl-linkedin-square bx-sm text-decoration-none text-reset'></a>
					<a href="mailto:tdhaussy@student.42angouleme.fr" class='bx bx-mail-send bx-sm text-decoration-none text-reset'></a>
				</div>
			</div>

			<div class="col d-flex flex-column align-items-center mx-1 rounded-3 card border-light">
				<div>
					<img class="rounded-4 mt-3" src="https://cdn.intra.42.fr/users/2fbb03a196de09235a1d843b6081ce7d/njegat.jpg" style="width: 7em; height: 7em; object-fit: cover; object-position: center;"/>
				</div>
				<span class="mt-2" style="font-size: 1.8em;">njegat</span>
				<span class="align-self-start mt-3" style="font-size: 1.3em;">${ await translate("about.about") } :</span>
				<p class="mt-1">${ await translate("about.42_stud") }</p>
				<div class="d-flex justify-content-evenly w-100 mb-3">
					<a href="https://github.com/swotex" class='bx bxl-github bx-sm text-decoration-none text-reset'></a>
					<a href="https://fr.linkedin.com/in/nicolas-jegat-b13440179" class='bx bxl-linkedin-square bx-sm text-decoration-none text-reset'></a>
					<a href="mailto:nicojegat21@gmail.com" class='bx bx-mail-send bx-sm text-decoration-none text-reset'></a>
				</div>
			</div>

			<div class="col d-flex flex-column align-items-center mx-1 rounded-3 card border-light">
				<div>
					<img class="rounded-4 mt-3" src="https://cdn.intra.42.fr/users/556a364b2cdfb47ada125d9667564004/jfarkas.jpg" style="width: 7em; height: 7em; object-fit: cover; object-position: center;"/>
				</div>
				<span class="mt-2" style="font-size: 1.8em;">jfarkas</span>
				<span class="align-self-start mt-3" style="font-size: 1.3em;">${ await translate("about.about") } :</span>
				<p class="mt-1">${ await translate("about.42_stud") }</p>
				<div class="d-flex justify-content-evenly w-100 mb-3">
					<a href="https://github.com/Jukaro" class='bx bxl-github bx-sm text-decoration-none text-reset'></a>
					<a href="mailto:jfarkas@student.42angouleme.fr" class='bx bx-mail-send bx-sm text-decoration-none text-reset'></a>
				</div>
			</div>

		</div>
	</div>
	<style>
		#about-container {
			display: none;
			width: 40em;
			height: 24.3em;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 9;
			border: 1px solid #d3d3d3;
		}

		#about-header {
			padding: 10px;
			height: 2em;
			cursor: move;
			z-index: 10;
			background-color: #2196F3;
			color: #fff;
		}
</style>
`;
