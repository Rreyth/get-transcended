import { Component } from "../../js/component.js";

export class LeadUser extends Component {
    static getName() {
        return "leaduser";
    }

	chooseColor(id) {
		if (id == 1)
			return "#CAAD13"
		else if (id == 2)
			return "#C1C2C7"
		else if (id == 3)
			return "#CD7F32"
	}

    connectedCallback() {

		this.innerHTML = /*html*/`
			<div>
				<span style="color: ${this.chooseColor(this.getAttribute("id"))};">${this.getAttribute("id")}</span>
				<span>|</span>
				<span>${this.getAttribute("name")}</span>
			</div>
			<span>${this.getAttribute("wins")}</span>
		`;
    }
}
