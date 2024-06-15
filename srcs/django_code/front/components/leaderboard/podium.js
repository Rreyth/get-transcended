import { Component } from "../../js/component.js";

export class Podium extends Component {
    static getName() {
        return "podium";
    }

    connectedCallback() {
		const users = JSON.parse(this.getAttribute("winners"));
		const sizeUser = Object.keys(users).length;

		this.innerHTML = /*html*/`
		<div class="col">
			<div class="d-flex flex-column">
				<i class='bx bx-crown bx-lg' style="color: #FFD700;"></i>
				<span style="font-size: 3em; color: #CAAD13;">${sizeUser > 0 ? users[0].username : "Nobody"}</span>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<i class='bx bx-medal bx-lg' style="color: #C1C2C7">${sizeUser > 1 ? users[1].username : "Nobody"}</i>
	
			</div>
			<div class="col">
			<i class='bx bx-medal bx-lg' style="color: #CD7F32;">${sizeUser > 2 ? users[2].username : "Nobody"}</i>
			</div>
		</div>
		`;
    }
}
