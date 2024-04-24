import { Component } from "../../js/component.js";

export class Setting extends Component {

    static getName() {
        return "setting"
    }

    connectedCallback() {
        super.connectedCallback()

        // const who = this.getAttribute('who') == "swotex" ? "msg-recieve" : "msg-sender"

        this.innerHTML = `
        <div class="setting">
			<div class="setting-head">
				<a class="setting-close" id="cross"></a>
			</div>
			<div class="setting-body">
				<div class="friend-list">
					coucou
				</div>
				<div class="research">
					<label for="formSearch">Find your friends</label>
					<div class="inputContainer">
						<div class="inputText">#</div>
						<input type="text" class="inputSearch" id="formSearch" placeholder="research friends">
						<i class='bx bx-search'></i>
					</div>
				</div>
			</div>
        </div>
        `
		this.addClickEvent('#cross', (e) => {
			document.getElementById("setting-tag").remove();
			document.body.style.overflow = "scroll";
		})
    }

}