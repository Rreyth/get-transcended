import { Component } from "../../js/component.js";
import { user } from "../../js/helpers.js";

export class Message extends Component {

    static getName() {
        return "message"
    }

    async connectedCallback() {
        super.connectedCallback()

        const who = this.getAttribute('who') == (await user()).username ? "msg-recieve" : "msg-sender"

        this.innerHTML = `
        <div class="${who}">
            <div class="msg-container">
                <p class="msg-title">${this.getAttribute('who')}</p>
                <div class="msg-content">
                    <p>
                        ${this.getAttribute('content')}
                    </p>
                    <span>${this.getAttribute('date')}</span>
                </div>
            </div>
        </div>
        `
    }

}