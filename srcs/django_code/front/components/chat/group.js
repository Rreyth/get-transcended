import { Component } from "../../js/component.js";
import { Chat } from "../chat.js";
import { translate } from "../../js/helpers.js"

export class Group extends Component
{
    static groupSelected = null

    static getName()
    {
        return "group"
    }

    connectedCallback()
    {
        super.connectedCallback()

        this.groupId = this.getAttribute('group-id')
        this.groupName = this.getAttribute('group-name')

        this.classList.add("list-group-item", "list-group-item-action")

        this.innerHTML = /* html */`
            <div class="d-flex align-items-center gap-2">
                <span>${this.groupName}</span>
            </div>
        `
    }

    async handleClick(ev)
    {      
        Group.groupSelected = this

        Chat.displayConversation('GROUP', this)
        Chat.chatInput.placeholder = await translate("chat.input_placeholder")
    }
}