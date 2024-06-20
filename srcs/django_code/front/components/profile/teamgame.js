import { Component } from "../../js/component.js";

export class TeamGame extends Component
{
    static getName()
    {
        return "teamgame"
    }

    link(username)
    {
        return `<a href="/profile/${username}">${username}</a>`
    }

    connectedCallback()
    {
        const at = new Date(this.getAttribute("at"));
        const player = JSON.parse(this.getAttribute("player"));
		const all_players = JSON.parse(this.getAttribute("all-players"));

        let players_team = [];
        let opponents_team = [];

        players_team.push(player);

        for (const p of all_players) {
            if (p.score == player.score && p.user.id != player.user.id)
                players_team.push(p);
            else if (p.user.id != player.user.id)
                opponents_team.push(p);
        }

        const bgColor = player.win ? 'text-bg-success' : 'text-bg-danger';

        this.innerHTML = `
            <li class="row d-flex align-items-center justify-content-between">
                <div class="col">
                    ${at.getHours()}h${at.getMinutes()}
                </div>
                <div class="col ms-2 fw-bold">
                    ${players_team[0].user.username} - ${this.link(players_team[1].user.username)}
                </div>
                <div class="col d-flex justify-content-center">
                    <span class="badge rounded-pill ${bgColor}">${players_team[0].score} - ${opponents_team[0].score}</span>
                </div>
                <div class="col ms-2 fw-bold text-end">
                    ${this.link(opponents_team[0].user.username)} - ${this.link(opponents_team[1].user.username)}
                </div>
            </li>
        `;
    }
}
