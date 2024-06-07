import { Component } from "../../js/component.js"

export class QuickGame extends Component
{
    static getName()
    {
        return "quickgame"
    }

    connectedCallback()
    {
        const bgColor = this.getAttribute('has_won') == 'true' ? 'text-bg-success' : 'text-bg-danger'

        this.innerHTML = /*html*/`<li class="row d-flex align-items-center">
            <div class="col">
                ${this.getAttribute("at")}
            </div>
            <div class="col ms-2 fw-bold">
                ${this.getAttribute("target-user-username")}
            </div>
            <div class="col d-flex justify-content-center">
                <span class="badge rounded-pill ${bgColor}">${this.getAttribute('target-user-score')} - ${this.getAttribute('opponent-score')}</span>
            </div>
            <div class="col ms-2 fw-bold text-end">
                <a href="/user/${this.getAttribute('opponent')}">${this.getAttribute('opponent')}</a>
            </div>
        </li>`
    }
}