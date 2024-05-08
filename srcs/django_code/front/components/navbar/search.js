import { Component } from "../../js/component.js";
import { user } from "../../js/helpers.js";

export class Search extends Component {
    static getName() {
        return "search";
    }


    async connectedCallback() {
		super.connectedCallback();
		// if (await user() != null)
        // {
        	this.innerHTML = /* html */ `
			<div class="w-100 h-100 d-flex justify-content-center">
				${this.getAttribute('content')}
			</div>
		`;
		// }
    }
}

