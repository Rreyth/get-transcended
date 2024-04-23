import { Component } from "../../js/component.js";

export class Message extends Component
{

    static getName()
    {
        return "message"
    }

    connectedCallback()
    {
        super.connectedCallback()

        const who = this.getAttribute('who') == "reciever" ? "recieveMsg" : "sendMsg"

        this.innerHTML = `
        <div class="msgContainer">
            <div class="${who}">
                <p>${this.getAttribute('content')}</p>
            </div>
        </div>
        `
    }

}