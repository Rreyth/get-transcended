import { Component } from "../../js/component.js";
import { Chat } from "../chat.js";

export class Friend extends Component
{

    static friendSelected = null

    static getName()
    {
        return "friend"
    }

    connectedCallback()
    {
        super.connectedCallback()

        this.username = this.getAttribute('username')
        this.classList.add("list-group-item", "list-group-item-action")

        this.innerHTML = /* html */`
            <div class="d-flex align-items-center gap-2" id="user-card">
                <img src="${this.getAttribute('avatar')}" class="rounded-4" style="width: 2em; height: 2em;" />
                <span>${this.username}</span>
            </div>
        `
    }

    handleClick(ev)
    {
        Friend.friendSelected = this

        Chat.displayDmWith(this.getAttribute('username'))
    }
}