import { Component } from "../../js/component.js";

export class SquareGame extends Component
{
    static getName()
    {
        return "squaregame"
    }

    async connectedCallback()
    {
		const mainPlayer = JSON.parse(this.getAttribute(`main-player`));
		const opponentPlayer = JSON.parse(this.getAttribute(`opponent-player`));
		const at = new Date (this.getAttribute(`at`));
        this.innerHTML = await content(mainPlayer, opponentPlayer, at);
    }
}

const addPlayer = (username, win, score, me) => {
	const userHTML = me ? username : `<a href="/user/${username}">${username}</a>`;

	return `
		<div class=" ms-2 fw-bold">
			${userHTML}
			<span class="badge rounded-pill text-bg-${win ? "success" : "danger"}">${score}</span>
		</div>
	`;
}

const content = async (mainPlayer, opponentPlayer, at) =>{/*html*/ return`
	<li class="d-flex justify-content-between align-items-center text-center">
		<div class="">
			${at.getHours()}h${at.getMinutes()}
		</div>
		${addPlayer(mainPlayer.user.username, mainPlayer.win, mainPlayer.score, true)}
		${addPlayer(opponentPlayer[0].user.username, opponentPlayer[0].win, opponentPlayer[0].score, false)}
		${addPlayer(opponentPlayer[1].user.username, opponentPlayer[1].win, opponentPlayer[1].score, false)}
		${addPlayer(opponentPlayer[2].user.username, opponentPlayer[2].win, opponentPlayer[2].score, false)}
	</li>
	`}
