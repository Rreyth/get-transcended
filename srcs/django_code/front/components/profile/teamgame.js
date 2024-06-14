import { Component } from "../../js/component.js";

export class TeamGame extends Component
{
    static getName()
    {
        return "teamgame"
    }

    link(username)
    {
        return `<a is="c-link" href="/user/${username}">${username}</a>`
    }

    connectedCallback()
    {
        const bgColor = this.getAttribute('has_won') == 'true' ? 'text-bg-success' : 'text-bg-danger'
		const time = new Date(this.getAttribute("at"));

        this.innerHTML = /*html*/`<li class="row d-flex align-items-center">
            <div class="col">
                ${time.getHours()}h${time.getMinutes()}
            </div>
            <div class="col ms-2 fw-bold">
                ${this.getAttribute("player-1-username")} - ${this.link(this.getAttribute("player-2-username"))}
            </div>
            <div class="col d-flex justify-content-center">
                <span class="badge rounded-pill ${bgColor}">${this.getAttribute('team-1-score')} - ${this.getAttribute('team-2-score')}</span>
            </div>
            <div class="col ms-2 fw-bold text-end">
                ${this.link(this.getAttribute("player-3-username"))} - ${this.link(this.getAttribute("player-4-username"))}
            </div>
        </li>`
    }
}
