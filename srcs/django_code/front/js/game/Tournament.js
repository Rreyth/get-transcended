import { Button } from "./Button.js";
import { Arrow } from "./Arrow.js";
import { Vec2 } from "./Vec2.js";
import { canvas, ctx } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";

export class Tournament {
	constructor(mods, nb_players, nb_ai, max_score, online) { //state = (waiting, ongoing, end)
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4];
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true)];
		this.size[1] = (nb_players <= 20) ? canvas.height * 0.04 * nb_players : canvas.height * 0.04 * 20;
		this.visual.push(new Button("", canvas.width * 0.85, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		this.start_names = this.visual[1].y + (canvas.height * 0.025);
		const spec_size = [canvas.width  * 0.65, canvas.height * 0.65];
		this.spec_screen = new Button("", (canvas.width / 2) - (spec_size[0] / 2), (canvas.height / 2) - (spec_size[1] / 2), spec_size[0], spec_size[1], true);
		this.init_pos = this.start_names;
		this.nb_ai = nb_ai;
		this.max_players = nb_players;
		this.max_score = max_score;
		this.nb_players = (online) ? 1 : nb_players;
		this.mods = mods;
		this.online = online;
		this.state = (online) ? "waiting" : "ongoing";
		if (nb_players > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.977, canvas.height / 2 - (this.size[1] * 0.49), canvas.width * 0.02, canvas.height * 0.02, "up"),
							new Arrow("", canvas.width * 0.977, canvas.height / 2 + (this.size[1] * 0.465), canvas.width * 0.02, canvas.height * 0.02, "down")];
		}
		this.nb_match = nb_players - 1;
	}

	draw(id = 0) { //add top and bot text
		if (this.online)
			ctx.fillText("ID : " + id, canvas.width * 0.06, canvas.height * 0.1);
		ctx.font = Math.floor(canvas.height * 0.06) + "px pong-teko";
		this.button.draw();
		this.leftBox();
		this.rightBox();
		this.centerBox();
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		for (let b of this.visual) {
			b.draw();
		}
		if (this.arrows) {
			for (let arrow of this.arrows)
				arrow.draw()
		}
	}

	centerBox() { //add end state (winner is), ongoing state (next match in + spec mode)
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko"; //default for now (text in center Box)
		this.spec_screen.draw();
		if (this.state === "waiting") {
			ctx.fillText("WAITING FOR PLAYERS", canvas.width / 2, canvas.height * 0.45);
			ctx.fillText(this.nb_players + "/" + this.max_players, canvas.width / 2, canvas.height * 0.55);
		}
	}

	rightBox() {
		ctx.font = Math.floor(canvas.height * 0.04) + "px pong-teko";
		ctx.textAlign = "left";
		const gap = canvas.height * 0.04;
		let pos = this.start_names;
		for (let i = 0; i < this.nb_players; i++) {
			ctx.fillText("PLAYER", canvas.width * 0.86, pos); //max 9 carac else 9 + '.'
			ctx.fillText("(STATE)", canvas.width * 0.93, pos);
			pos += gap;
		}
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(this.visual[1].x, 0, this.visual[1].width, this.visual[1].y);
		ctx.fillRect(this.visual[1].x, this.visual[1].y + this.size[1], this.visual[1].width, this.visual[1].y);
		ctx.fillStyle = "white";
	}

	leftBox() { // add match score
		ctx.font = Math.floor(canvas.height * 0.05) + "px pong-teko";
		ctx.textAlign = "left";
		ctx.fillText((this.online) ? "ONLINE" : "LOCAL", canvas.width * 0.005, canvas.height * 0.35);
		ctx.fillText("PLAYERS:", canvas.width * 0.005, canvas.height * 0.40);
		ctx.fillText("AI:", canvas.width * 0.005, canvas.height * 0.45);
		ctx.fillText("BORDERLESS:", canvas.width * 0.005, canvas.height * 0.50);
		ctx.fillText("OBSTACLE:", canvas.width * 0.005, canvas.height * 0.55);
		ctx.fillText("MATCH SCORE:", canvas.width * 0.005, canvas.height * 0.60);
		ctx.fillText("MATCH LEFT:", canvas.width * 0.005, canvas.height * 0.65);
		ctx.textAlign = "center";
		ctx.fillText(this.max_players.toString(), canvas.width * 0.12, canvas.height * 0.40);
		ctx.fillText(this.nb_ai.toString(), canvas.width * 0.12, canvas.height * 0.45);
		ctx.fillText(this.mods.includes("BORDERLESS").toString(), canvas.width * 0.12, canvas.height * 0.50);
		ctx.fillText(this.mods.includes("OBSTACLE").toString(), canvas.width * 0.12, canvas.height * 0.55);
		ctx.fillText(this.max_score.toString(), canvas.width * 0.12, canvas.height * 0.60);
		ctx.fillText(this.nb_match.toString(), canvas.width * 0.12, canvas.height * 0.65);
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
		this.size[1] = (this.max_players <= 20) ? canvas.height * 0.04 * this.max_players : canvas.height * 0.04 * 20;	
		this.visual.push(new Button("", canvas.width * 0.87, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		if (this.max_players > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.977, canvas.height / 2 - (this.size[1] * 0.49), canvas.width * 0.02, canvas.height * 0.02, "up"),
							new Arrow("", canvas.width * 0.977, canvas.height / 2 + (this.size[1] * 0.465), canvas.width * 0.02, canvas.height * 0.02, "down")];
		}
	}
}