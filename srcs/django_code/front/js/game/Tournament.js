import { Button } from "./Button.js";
import { Arrow } from "./Arrow.js";
import { Vec2 } from "./Vec2.js";
import { canvas, ctx } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";

export class Tournament {
	constructor(mods, nb_players, nb_ai, online) {
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4];
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true)];
		this.size[1] = (nb_players <= 20) ? canvas.height * 0.04 * nb_players : canvas.height * 0.04 * 20;
		this.visual.push(new Button("", canvas.width * 0.87, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		this.start_names = this.visual[1].y + (canvas.height * 0.025);
		this.init_pos = this.start_names;
		this.nb_ai = nb_ai;
		this.nb_players = nb_players;
		this.mods = mods;
		this.online = online;
		if (nb_players > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.977, canvas.height / 2 - (this.size[1] * 0.49), canvas.width * 0.02, canvas.height * 0.02, "up"),
							new Arrow("", canvas.width * 0.977, canvas.height / 2 + (this.size[1] * 0.465), canvas.width * 0.02, canvas.height * 0.02, "down")];
		}
	}

	draw() {
		ctx.fillText("ID : TODO", canvas.width * 0.06, canvas.height * 0.1);
		ctx.font = Math.floor(canvas.height * 0.06) + "px pong-teko";
		this.button.draw();
		this.leftBox();
		this.rightBox();
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		for (let b of this.visual) {
			b.draw();
		}
		if (this.arrows) {
			for (let arrow of this.arrows)
				arrow.draw()
		}
	}

	rightBox() {
		ctx.font = Math.floor(canvas.height * 0.04) + "px pong-teko";
		ctx.textAlign = "left";
		const gap = canvas.height * 0.04;
		let pos = this.start_names;
		for (let i = 0; i < this.nb_players; i++) {
			ctx.fillText("PLAYER", canvas.width * 0.88, pos); //max 8 carac else 8 + '.'
			ctx.fillText("(STATE)", canvas.width * 0.94, pos);
			pos += gap;
		}
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(this.visual[1].x, 0, this.visual[1].width, this.visual[1].y);
		ctx.fillRect(this.visual[1].x, this.visual[1].y + this.size[1], this.visual[1].width, this.visual[1].y);
		ctx.fillStyle = "white";
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

	scroll(dir) {
		if (this.nb_players <= 20)
			return;
		const last_pos = this.start_names + ((canvas.height * 0.04) * (this.nb_players - 1)); 
		if (dir === "up" && this.start_names < this.init_pos) {
			this.start_names += canvas.height * 0.02;
		}
		else if (dir === "down" && last_pos > (this.visual[1].y + this.size[1])) {
			this.start_names -= canvas.height * 0.02;
		}
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		if (this.arrows) {
			for (let arrow of this.arrows) {
				if (is_colliding(pos, [0, 0], arrow.hitbox.pos, [arrow.width, arrow.height])) {
					this.scroll(arrow.dir);
					return;
				}
			}
		}

		if (is_colliding(pos, [0, 0], this.button.hitbox.pos, [this.button.width, this.button.height])) {
			core.state = "menu";
			core.mode = "none";
			core.max_score = 10;
			core.online = false;
			core.tournament_menu = false;
			core.tournament = false;
			//add leave state + msg for others
		}
	}

	responsive(old_sizes) {
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4]
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true)];
		let tmp = this.start_names / old_sizes[1];
		this.start_names = tmp * canvas.height;
		tmp = this.init_pos / old_sizes[1];
		this.init_pos = tmp * canvas.height;
		this.size[1] = (this.nb_players <= 20) ? canvas.height * 0.04 * this.nb_players : canvas.height * 0.04 * 20;	
		this.visual.push(new Button("", canvas.width * 0.87, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		if (this.nb_players > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.977, canvas.height / 2 - (this.size[1] * 0.49), canvas.width * 0.02, canvas.height * 0.02, "up"),
							new Arrow("", canvas.width * 0.977, canvas.height / 2 + (this.size[1] * 0.465), canvas.width * 0.02, canvas.height * 0.02, "down")];
		}
	}
}