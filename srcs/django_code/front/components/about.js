import { Component } from "../js/component.js";


export class About extends Component {
	static getName() {
		return "about";
    }
	
    async connectedCallback() {
		this.innerHTML = content;

		dragElement(document.getElementById("mydiv"));

		function dragElement(elmnt) {
			var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
			if (document.getElementById(elmnt.id + "header"))
			{
				document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
			}
			else
			{
				elmnt.onmousedown = dragMouseDown;
			}

			function dragMouseDown(e)
			{
				e = e || window.event;
				e.preventDefault();
				// get the mouse cursor position at startup:
				pos3 = e.clientX;
				pos4 = e.clientY;
				document.onmouseup = closeDragElement;
				// call a function whenever the cursor moves:
				document.onmousemove = elementDrag;
			}

			function elementDrag(e)
			{
				e = e || window.event;
				e.preventDefault();
				// calculate the new cursor position:
				pos1 = pos3 - e.clientX;
				pos2 = pos4 - e.clientY;
				pos3 = e.clientX;
				pos4 = e.clientY;
				// set the element's new position:
				elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
			}

			function closeDragElement()
			{
				document.onmouseup = null;
				document.onmousemove = null;
			}
		}
    }
}

const content = /*html*/`
	<div id="mydiv">
		<div class="d-flex align-items-center justify-content-between" id="mydivheader">
			about us
			<i class='bx bx-x bx-md' style="cursor: pointer;" onclick="console.log('coucou');"></i>
		</div>
		<div>
			<img src="https://cdn.intra.42.fr/users/2fbb03a196de09235a1d843b6081ce7d/njegat.jpg" style="width: 10em; height: 10em; object-fit: cover; object-position: center;"/>
			<img src="https://cdn.intra.42.fr/users/bc8f6250a88ae6316c4207e18fb99776/ltuffery.jpg" style="width: 10em; height: 10em; object-fit: cover; object-position: center;"/>
			<img src="https://cdn.intra.42.fr/users/39294f3af6fdff159c137a24f6639c9f/tdhaussy.jpg" style="width: 10em; height: 10em; object-fit: cover; object-position: center;"/>
		</div>
		<p>Move</p>
		<p>this</p>
		<p>DIV</p>
	</div>
	<style>
		#mydiv {
			width: 31.5em;
			height: 25em;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 9;
			background-color: #f1f1f1;
			border: 1px solid #d3d3d3;
			text-align: center;
		}

		#mydivheader {
			padding: 10px;
			height: 2em;
			cursor: move;
			z-index: 10;
			background-color: #2196F3;
			color: #fff;
		}
</style>
`;
