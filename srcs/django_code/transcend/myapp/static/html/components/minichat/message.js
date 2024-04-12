import { Component } from "../../../js/component.js";

export class Message extends Component
{

    static getName()
    {
        return "message"
    }

    rules()
    {
        return {
            content: ['required'],
            who: ['required']
        }
    }

    connectedCallback()
    {
        super.connectedCallback()

        const who = this.who == "reciever" ? "recieveMsg" : "sendMsg"

        this.innerHTML = `
        <div class="msgContainer">
            <div class="${who}">
                <p>${this.content}</p>
            </div>
        </div>
        `
    }

}