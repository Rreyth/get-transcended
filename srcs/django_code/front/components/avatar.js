import { Component } from "../js/component.js"
import { getAvatarUrl } from "../js/helpers.js"

export class Avatar extends Component
{
    static getName()
    {
        return "avatar"
    }

    connectedCallback()
    {
        this.innerHTML = /* html */`
            <img class="rounded-4 border border-${this.getAttribute('connected') === 'true' ? 'success' : 'secondary'} border-3 img-fluid" src="${getAvatarUrl(this.getAttribute("src"))}" style="object-fit: cover; object-position: center; width: ${this.style.width}; height: ${this.style.height};" />
        `
    }
}