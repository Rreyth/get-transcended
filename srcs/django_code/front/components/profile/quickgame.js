import { Component } from "../../js/component.js"

export class QuickGame extends Component
{
    static getName()
    {
        return "quickgame"
    }

    connectedCallback()
    {
		const time = new Date(this.getAttribute("at"));
		const targetUser = JSON.parse(this.getAttribute('target-user'));
		const opponent = JSON.parse(this.getAttribute('opponent'));
        const bgColor = targetUser.win ? 'text-bg-success' : 'text-bg-danger';

        this.innerHTML = /*html*/`<li class="row d-flex align-items-center">
            <div class="col">
                ${time.getHours()}h${time.getMinutes()}
            </div>
            <div class="col ms-2 fw-bold">
                ${targetUser.user.username}
            </div>
            <div class="col d-flex justify-content-center">
                <span class="badge rounded-pill ${bgColor}">${targetUser.score} - ${opponent.score}</span>
            </div>
            <div class="col ms-2 fw-bold text-end">
                <a href="/user/${opponent.user.username}">${opponent.user.username}</a>
            </div>
        </li>`
    }
}