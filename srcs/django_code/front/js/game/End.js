import { Button } from "./Button.js";
import { canvas, ctx } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";
import { Vec2 } from "./Vec2.js";

export class End {
	constructor() {
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.button = new Button("BACK TO MENU", (canvas.width / 2) - (this.size[0] / 2), canvas.height * 0.8, this.size[0], this.size[1]);
	}

	draw(core, score) {
		if (core.square) {
			this.drawSquare(core, score);
			this.button = new Button("BACK TO MENU", canvas.width * 0.77, canvas.height * 0.85, this.size[0], this.size[1]);
		}
		else {
			let text = []
			for (let i = 0; i < 2; i++) {
				text.push(core.players[i].name);
				text.push(core.players[i].win);
				text.push(score[i]);
			}
			let pos = [[canvas.width / 3, canvas.height / 3],
					[canvas.width / 3, canvas.height / 2],
					[canvas.width * 0.45, canvas.height / 2],
					[canvas.width / 3 * 2, canvas.height / 3],
					[canvas.width / 3 * 2, canvas.height / 2],
					[canvas.width * 0.55, canvas.height / 2]];
			
			if (core.players.length === 4) {
				pos.push([pos[3][0], pos[3][1]]);
				pos[3][0] = pos[0][0];
				pos[0][0] -= this.size[0];
				text[4] = core.players[2].win;
				text.push(core.players[2].name);
				text.push(core.players[3].name);
				pos.push([pos[6][0] + this.size[0], pos[6][1]]);
			}
			text.push("_");
			pos.push([canvas.width / 2, canvas.height * 0.465]);

			ctx.font = Math.floor(canvas.height * 0.1) + "px pong-teko";
			for (let i = 0; i < text.length; i++)
				ctx.fillText(text[i], pos[i][0], pos[i][1]);
			ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		}
		this.button.draw();
	}

	drawSquare(core, score) {
		let text = [];
		for (let i = 0; i < core.players.length; i++) {
			text.push(core.players[i].name);
			text.push(core.players[i].win);
			text.push(score[i]);
		}

		let pos = [[canvas.width / 5, canvas.height / 2],
					[canvas.width / 5 * 2, canvas.height / 2],
					[canvas.width * 0.47, canvas.height / 2],
					[canvas.width / 5 * 4, canvas.height / 2],
					[canvas.width / 5 * 3, canvas.height / 2],
					[canvas.width * 0.53, canvas.height / 2],
					[canvas.width / 2, canvas.height / 8],
					[canvas.width / 2, canvas.height / 4],
					[canvas.width / 2, canvas.height * 0.4],
					[canvas.width / 2, canvas.height / 8 * 7],
					[canvas.width / 2, canvas.height / 4 * 3],
					[canvas.width / 2, canvas.height * 0.6]];

		ctx.font = Math.floor(canvas.height * 0.1) + "px pong-teko";
		for (let i = 0; i < text.length; i++)
			ctx.fillText(text[i], pos[i][0], pos[i][1]);
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		if (is_colliding(pos, [0, 0], this.button.hitbox.pos, this.size)) {
			core.state = "menu";
			core.mode = "none";
			core.pause[0] = false;
			core.pause[1].freeze = false;
			core.start_screen = false;
			core.wait_screen = false;
			core.custom_menu = false;
			core.ai = [];
			core.max_score = 10;
			core.online = false;
		}
	}

	responsive() {
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.button = new Button("BACK TO MENU", (canvas.width / 2) - (this.size[0] / 2), canvas.height * 0.8, this.size[0], this.size[1]);
	}
}