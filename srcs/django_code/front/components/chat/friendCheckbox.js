import { Component } from "../../js/component.js";

export class FriendCheckbox extends Component
{
    static getName()
    {
        return "friend-checkbox"
    }

    connectedCallback()
    {
        this.classList.add('form-check')

        this.innerHTML = /* html */`
            <input data-friend class="form-check-input" type="checkbox" value="" id="${this.getAttribute('username')}-checkbox" ${this.getAttribute('checked') === 'true' ? 'checked disabled' : ''}>
            <label class="form-check-label" for="${this.getAttribute('username')}-checkbox">
                ${this.getAttribute('username')}
            </label>
        `
    }
}