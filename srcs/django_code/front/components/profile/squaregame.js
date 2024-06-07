import { Component } from "../../js/component.js";

export class SquareGame extends Component
{
    static getName()
    {
        return "squaregame"
    }

    getBackgroundBadge(num)
    {
        return this.getAttribute(`player-${num}-score`) == this.getAttribute('player-winner-score') ? "success" : "danger"
    }

    connectedCallback()
    {
        this.innerHTML = /*html*/`<li class="row d-flex align-items-center text-center">
            <div class="col ms-2 fw-bold">
                ${this.getAttribute("player-1-username")}
                <span class="badge rounded-pill text-bg-${this.getBackgroundBadge(1)}">${this.getAttribute('player-1-score')}</span>
            </div>
            <div class="col ms-2 fw-bold">
                <a href="/user/${this.getAttribute("player-2-username")}">${this.getAttribute("player-2-username")}</a>
                <span class="badge rounded-pill text-bg-${this.getBackgroundBadge(2)}">${this.getAttribute('player-2-score')}</span>
            </div>
            <div class="col ms-2 fw-bold">
                <a href="/user/${this.getAttribute("player-3-username")}">${this.getAttribute("player-3-username")}</a>
                <span class="badge rounded-pill text-bg-${this.getBackgroundBadge(3)}">${this.getAttribute('player-3-score')}</span>
            </div>
            <div class="col ms-2 fw-bold">
                <a href="/user/${this.getAttribute("player-4-username")}">${this.getAttribute("player-4-username")}</a>
                <span class="badge rounded-pill text-bg-${this.getBackgroundBadge(4)}">${this.getAttribute('player-4-score')}</span>
            </div>
        </li>`
    }
}