import { canvas, ctx } from "./canvas.js";
import { Button } from "./Button.js";
import { Wall } from "./Wall.js";
import { Player } from "./Player.js";
import { Obstacle } from "./Obstacle.js";
import { Ball } from "./Ball.js";
import { AI } from "./AI.js";
import { Vec2 } from "./Vec2.js";
import { is_colliding } from "./Hitbox.js";
import { Tournament } from "./Tournament.js";

export class TournamentMenu {
	constructor() {
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.mod_size = [canvas.width * 0.11, canvas.height * 0.07];
		this.score = 10;
		this.ai_nb = 0;
		this.max_ai = 2;
		this.nb_players = 2;
		this.down_buttons = [new Button("BACK TO MENU", this.size[0] * 0.1, canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1]),
				new Button("START", canvas.width - (this.size[0] * 1.1), canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1])];
		this.mod_buttons = [new Button("LOCAL", canvas.width / 5 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
              	new Button("ONLINE", canvas.width / 5 * 2 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
          		new Button("BORDERLESS", canvas.width / 5 * 3 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
            	new Button("OBSTACLE", canvas.width / 5 * 4 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1])];
		this.param_buttons = [new Button("-", canvas.width * 0.335, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.355, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("-", canvas.width * 0.56, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.58, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("-", canvas.width * 0.835, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.855, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03)];
		this.mod_buttons[0].highlight = true;
	}

	draw() {
		ctx.fillText("TOURNAMENT", canvas.width / 2, canvas.height * 0.1);
		for (let b of this.down_buttons)
			b.draw();
		ctx.font = Math.floor(canvas.height * 0.06) + "px pong-teko";
		ctx.fillText("MATCH SCORE = " + this.score, canvas.width / 4, canvas.height / 3 * 2);
		ctx.fillText("PLAYERS = " + this.nb_players, canvas.width / 2, canvas.height / 3 * 2);
		ctx.fillText("AI OPPONENTS = " + this.ai_nb, canvas.width / 4 * 3, canvas.height / 3 * 2);
		for (let b of this.mod_buttons)
			b.draw();
		for (let b of this.param_buttons)
			b.draw();
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		for (let b of this.down_buttons) {
			if (is_colliding(pos, [0, 0], b.hitbox.pos, this.size)) {
				if (b.name === "BACK TO MENU") {
					core.state = "menu";
					core.mode = "none";
					core.max_score = 10;
					core.tournament_menu = false;
					break;
				}
				else if (b.name === "START") {
					this.start(core);
					break;
				}
			}
		}
		for (let b of this.mod_buttons) {
			if (is_colliding(pos, [0, 0], b.hitbox.pos, this.mod_size)) {
				if (b.name === "LOCAL" && !b.highlight)
					this.mod_buttons[1].highlight = false;
				else if (b.name === "ONLINE" && !b.highlight)
					this.mod_buttons[0].highlight = false;
				b.highlight = !b.highlight;
				break;
			}
		}
		for (let b of this.param_buttons) {
			if (is_colliding(pos, [0, 0], b.hitbox.pos, [b.width, b.height])) {
				if (b === this.param_buttons[0] || b === this.param_buttons[1]) {
					if (b.name === "-" && this.score > 1)
						this.score -= 1;
					else if (b.name === "+")
						this.score += 1;
				}
				else if (b === this.param_buttons[2] || b === this.param_buttons[3]) {
					if (b.name === "-" && this.nb_players > 2) {
						this.nb_players -= 1;
						if (this.ai_nb > this.nb_players)
							this.ai_nb = this.nb_players;
					}
					else if (b.name === "+")
						this.nb_players += 1;
					this.max_ai = this.nb_players;
				}
				else {
					if (b.name === "-" && this.ai_nb > 0)
						this.ai_nb -= 1;
					else if (b.name === "+" && this.ai_nb < this.max_ai)
						this.ai_nb += 1;
				}
				break;
			}
		}
		if (this.ai_nb >= this.nb_players - 1) {
			this.mod_buttons[1].highlight = false;
			this.mod_buttons[0].highlight = true;
		}
	}

	start(core) {
		if (!this.validStart())
			return;
		this.getMods(core.alias);
		core.max_score = this.score;
		if (this.mod_list.includes("LOCAL")) {
			this.initPlayers(core);
			this.initWalls(core);
			core.ball = new Ball((this.mod_list.includes("BORDERLESS")) ? true : false);
			core.state = "tournament";
			core.mode = "LOCAL";
			if (this.mod_list.includes("OBSTACLE"))
				core.obstacle = new Obstacle();
			const msg = {"type" : 'tournament', 'online' : 'false'};
			core.GameHub.send(JSON.stringify(msg));
		}
		else if (this.mod_list.includes("ONLINE")) {
			const msg = {"type" : 'tournament', 'online' : 'true', 'mods' : this.mod_list, 'score' : this.score, 'ai' : this.ai_nb, 'players' : Object.keys(this.players).length};
			core.GameHub.send(JSON.stringify(msg));
			core.online = true;
		}

		core.tournament = new Tournament(this.mod_list, this.nb_players, this.ai_nb, this.score, core.online);
	}

	getMods(alias = "Player") {
		this.mod_list = [];
		for (let b of this.mod_buttons) {
			if (b.highlight)
				this.mod_list.push(b.name);
		}
		this.players = {};
		for (let i = 0; i < this.nb_players; i++) {
			this.players[i + 1] = (this.ai_nb < this.nb_players - i) ? alias + (i + 1).toString() : "AI";
		}
	}

	initPlayers(core) {
		core.players = [];
		for (const key in this.players)
			core.players.push(new Player(parseInt(key), this.players[key], Object.keys(this.players).length, this.mod_list.includes("BORDERLESS"), false));
		for (let p of core.players)
			if (p.name === "AI")
				core.ai.push(new AI(p));
	}

	initWalls(core) {
		if (this.mod_list.includes("BORDERLESS"))
			core.walls = false;
		else
			core.walls = [new Wall("up", false), new Wall("down", false)];
	}

	validStart() {
		for (let b of this.mod_buttons) {
			if (b.highlight && b.name === "LOCAL") {
				return true;
			}
			if (b.highlight && b.name === "ONLINE") {
				return true;
			}
		}
		return false;
	}

	responsive() {
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.mod_size = [canvas.width * 0.11, canvas.height * 0.07];

		this.down_buttons = [new Button("BACK TO MENU", this.size[0] * 0.1, canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1]),
				new Button("START", canvas.width - (this.size[0] * 1.1), canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1])];
		this.mod_buttons = [new Button("LOCAL", canvas.width / 5 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
              	new Button("ONLINE", canvas.width / 5 * 2 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
          		new Button("BORDERLESS", canvas.width / 5 * 3 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
            	new Button("OBSTACLE", canvas.width / 5 * 4 - (this.mod_size[0] / 2), canvas.height / 3 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1])];
		this.param_buttons = [new Button("-", canvas.width * 0.335, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.355, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("-", canvas.width * 0.56, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.58, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("-", canvas.width * 0.835, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.855, canvas.height / 3 * 2 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03)];
		this.mod_buttons[0].highlight = true;
	}
}