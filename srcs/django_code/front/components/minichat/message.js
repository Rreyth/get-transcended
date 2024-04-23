import { Component } from "../../js/component.js";

export class Message extends Component {

    static getName() {
        return "message"
    }

    connectedCallback() {
        super.connectedCallback()

        const who = this.getAttribute('who') == "swotex" ? "msg-recieve" : "msg-sender"

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