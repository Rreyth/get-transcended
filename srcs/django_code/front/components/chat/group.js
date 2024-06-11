import { Component } from "../../js/component.js";

export class Group extends Component
{
    static getName()
    {
        return "group"
    }

    connectedCallback()
    {
        this.classList.add("list-group-item", "list-group-item-action")

        this.innerHTML = /* html */`
            <div class="d-flex align-items-center gap-2" id="group-card">
                <span>${this.getAttribute('name')}</span>
            </div>
        `
    }
}