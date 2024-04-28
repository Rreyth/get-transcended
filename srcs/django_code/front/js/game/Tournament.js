import { Button } from "./Button.js";
import { canvas, ctx } from "./canvas.js";

export class Tournament {
	constructor(mods, nb_players, nb_ai, online) {
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4];
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true)];
		this.size[1] = (nb_players <= 20) ? canvas.height * 0.04 * nb_players : canvas.height * 0.04 * 20;
		this.visual.push(new Button("", canvas.width * 0.87, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		this.nb_ai = nb_ai;
		this.nb_players = nb_players;
		this.mods = mods;
		this.online = online;
	}

	draw() {
		for (let b of this.visual) {
			b.draw();
		}
		ctx.fillText("ID : TODO", canvas.width * 0.06, canvas.height * 0.1);
		ctx.font = Math.floor(canvas.height * 0.06) + "px pong-teko";
		this.button.draw();
		this.leftBox();
		this.rightBox();
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
	}

	rightBox() {
		ctx.font = Math.floor(canvas.height * 0.04) + "px pong-teko";
		ctx.textAlign = "left";
		const gap = canvas.height * 0.04;
		let pos = this.visual[1].y + (gap * 0.6);
		for (let i = 0; i < this.nb_players; i++) {
			ctx.fillText("PLAYER", canvas.width * 0.88, pos);
			ctx.fillText("STATE", canvas.width * 0.95, pos);
			pos += gap;
		}
		ctx.textAlign = "center";
	}

	leftBox() {
		ctx.font = Math.floor(canvas.height * 0.05) + "px pong-teko";
		ctx.textAlign = "left";
		ctx.fillText((this.online) ? "ONLINE" : "LOCAL", canvas.width * 0.005, canvas.height * 0.35);
		ctx.fillText("PLAYERS:", canvas.width * 0.005, canvas.height * 0.41);
		ctx.fillText("AI:", canvas.width * 0.005, canvas.height * 0.47);
		ctx.fillText("BORDERLESS:", canvas.width * 0.005, canvas.height * 0.53);
		ctx.fillText("OBSTACLE:", canvas.width * 0.005, canvas.height * 0.59);
		ctx.fillText("MATCH LEFT:", canvas.width * 0.005, canvas.height * 0.65);
		ctx.textAlign = "center";
		ctx.fillText(this.nb_players.toString(), canvas.width * 0.12, canvas.height * 0.41);
		ctx.fillText(this.nb_ai.toString(), canvas.width * 0.12, canvas.height * 0.47);
		ctx.fillText(this.mods.includes("BORDERLESS").toString(), canvas.width * 0.12, canvas.height * 0.53);
		ctx.fillText(this.mods.includes("OBSTACLE").toString(), canvas.width * 0.12, canvas.height * 0.59);
		ctx.fillText("TODO", canvas.width * 0.12, canvas.height * 0.65);
	}

	responsive() {
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4]
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1])];
	}
}