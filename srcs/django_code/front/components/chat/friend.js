import { Component } from "../../js/component.js";
import { Chat } from "../chat.js";
import { getAvatarUrl } from "../../js/helpers.js"

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
                <c-avatar src="${this.getAttribute('avatar')}" style="width: 2em; height: 2em;" username="${this.username}" connected="${this.getAttribute('connected')}"></c-avatar>
                <span>${this.username}</span>
            </div>
        `
    }

    handleClick(ev)
    {
        Friend.friendSelected = this

        Chat.displayConversation('FRIEND', this.username)
    }
}