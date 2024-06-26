import { canvas, ctx } from "./canvas.js";
import { Button } from "./Button.js";
import { Wall } from "./Wall.js";
import { Player } from "./Player.js";
import { Obstacle } from "./Obstacle.js";
import { Ball } from "./Ball.js";
import { StartScreen } from "./StartScreen.js";
import { AI } from "./AI.js";
import { Vec2 } from "./Vec2.js";
import { is_colliding } from "./Hitbox.js";

export class CustomMenu {
	constructor() {
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.mod_size = [canvas.width * 0.11, canvas.height * 0.07];
		this.score = 5;
		this.ai_nb = 0;
		this.max_ai = 2;
		this.down_buttons = [new Button("BACK TO MENU", this.size[0] * 0.1, canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1]),
				new Button("START", canvas.width - (this.size[0] * 1.1), canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1])];
		this.players_buttons = [new Button("AI VS AI", canvas.width / 5 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
       			new Button("1 VS 1", canvas.width / 5 * 2 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
          		new Button("2 VS 2", canvas.width / 5 * 3 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
            	new Button("1V1V1V1", canvas.width / 5 * 4 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1])];
		this.mod_buttons = [new Button("LOCAL", canvas.width / 5 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
              	new Button("ONLINE", canvas.width / 5 * 2 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
          		new Button("BORDERLESS", canvas.width / 5 * 3 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
            	new Button("OBSTACLE", canvas.width / 5 * 4 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1])];
		this.param_buttons = [new Button("-", canvas.width * 0.415, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.435, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("-", canvas.width * 0.755, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.775, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03)];
		this.players_buttons[1].highlight = true;
		this.mod_buttons[0].highlight = true;
	}

	draw() {
		ctx.fillText("CUSTOM", canvas.width / 2, canvas.height * 0.1);
		for (let b of this.down_buttons)
			b.draw();
		ctx.font = Math.floor(canvas.height * 0.06) + "px pong-teko";
		ctx.fillText("MAX SCORE = " + this.score, canvas.width / 3, canvas.height / 4 * 3);
		ctx.fillText("AI OPPONENTS = " + this.ai_nb, canvas.width / 3 * 2, canvas.height / 4 * 3);
		for (let b of this.players_buttons)
			b.draw();
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
					core.max_score = 5;
					core.custom_menu = false;
					break;
				}
				else if (b.name === "START") {
					this.start(core);
					break;
				}
			}
		}
		for (let b of this.players_buttons) {
			if (is_colliding(pos, [0, 0], b.hitbox.pos, this.mod_size)) {
				if (!b.highlight)
					for (let other of this.players_buttons)
						other.highlight = false;
				b.highlight = !b.highlight;
				this.max_ai = (b.name === "AI VS AI" || b.name === "1 VS 1") ? 2 : 4;
				this.ai_nb = 0;
				break;
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
					if (b.name === "-" && this.score > 0)
						this.score -= 1;
					else if (b.name === "+")
						this.score += 1;
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

		if (this.players_buttons[0].highlight) {
			this.ai_nb = 2;
			this.mod_buttons[0].highlight = true;
			this.mod_buttons[1].highlight = false;
		}
		else if (this.players_buttons[1].highlight && this.ai_nb > 0) {
			this.mod_buttons[0].highlight = true;
			this.mod_buttons[1].highlight = false;
		}
		else if (this.players_buttons[3].highlight)
			this.mod_buttons[2].highlight = false;

		if (this.players_buttons[2].highlight || this.players_buttons[3].highlight) {
			if (this.ai_nb >= 3) {
				this.mod_buttons[0].highlight = true;
				this.mod_buttons[1].highlight = false;
			}
		}
	}

	start(core) {
		if (!this.validStart())
			return;
		this.getMods(core.alias);
		core.max_score = this.score;
		core.customs = this.mod_list;
		if (this.mod_list.includes("LOCAL")) {
			this.initPlayers(core);
			this.initWalls(core);
			core.ball = new Ball((this.mod_list.includes("BORDERLESS")) ? true : false);
			core.state = "start";
			core.mode = "LOCAL";
			if (this.mod_list.includes("OBSTACLE"))
				core.obstacle = new Obstacle();
			const msg = {"type" : 'custom', 'online' : 'false'};
			core.GameHub.send(JSON.stringify(msg));
		}
		else if (this.mod_list.includes("ONLINE")) {
			const msg = {"type" : 'custom', 'online' : 'true', 'mods' : this.mod_list, 'score' : this.score, 'ai' : this.ai_nb, 'players' : Object.keys(this.players).length};
			core.GameHub.send(JSON.stringify(msg));
			core.online = true;
		}
		if (this.mod_list.includes("1V1V1V1"))
			core.square = true;

		core.start_screen = new StartScreen("custom", core.online, core.square, Object.keys(this.players).length);
	}

	getMods(alias = "Player") {
		this.mod_list = [];
		for (let b of this.mod_buttons) {
			if (b.highlight)
				this.mod_list.push(b.name);
		}

		this.players = {};
		for (let b of this.players_buttons) {
			if (b.highlight) {
				if (b.name === "AI VS AI") {
					this.players[1] = "AI";
					this.players[2] = "AI";
				}
				else if (b.name === "1 VS 1") {
					this.players[1] = (this.ai_nb < 2) ? alias + "1" : "AI";
					this.players[2] = (this.ai_nb < 1) ? alias + "2" : "AI";
				}
				else if (b.name === "2 VS 2") {
					this.players[1] = (this.ai_nb < 4) ? alias + "1" : "AI";
					this.players[2] = (this.ai_nb < 3) ? alias + "2" : "AI";
					this.players[3] = (this.ai_nb < 2) ? alias + "3" : "AI";
					this.players[4] = (this.ai_nb < 1) ? alias + "4" : "AI";
				}
				else if (b.name === "1V1V1V1") {
					this.mod_list.push("1V1V1V1");
					this.players[1] = (this.ai_nb < 4) ? alias + "1" : "AI";
					this.players[2] = (this.ai_nb < 3) ? alias + "2" : "AI";
					this.players[3] = (this.ai_nb < 2) ? alias + "3" : "AI";
					this.players[4] = (this.ai_nb < 1) ? alias + "4" : "AI";
				}
				break;
			}
		}
	}

	initPlayers(core) {
		core.players = [];
		for (const key in this.players)
			core.players.push(new Player(parseInt(key), this.players[key], Object.keys(this.players).length, this.mod_list.includes("BORDERLESS"), this.mod_list.includes("1V1V1V1")));
		for (let p of core.players)
			if (p.name === "AI")
				core.ai.push(new AI(p));
	}

	initWalls(core) {
		if (this.mod_list.includes("BORDERLESS"))
			core.walls = false;
		else if (this.mod_list.includes("1V1V1V1"))
			core.walls = [new Wall("up", true), new Wall("down", true), new Wall("left", true), new Wall("right", true)];
		else
			core.walls = [new Wall("up", false), new Wall("down", false)];
	}

	validStart() {
		let selected = false;
		for (let b of this.players_buttons) {
			if (b.highlight) {
				selected = true;
				break;
			}
		}
		if (!selected)
			return false;
		selected = false;
		for (let b of this.mod_buttons) {
			if (b.highlight && b.name === "LOCAL") {
				selected = true;
				break;
			}
			if (b.highlight && b.name === "ONLINE") {
				selected = true;
				break;
			}
		}
		return selected;
	}

	responsive() {
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.mod_size = [canvas.width * 0.11, canvas.height * 0.07];

		this.down_buttons = [new Button("BACK TO MENU", this.size[0] * 0.1, canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1]),
				new Button("START", canvas.width - (this.size[0] * 1.1), canvas.height - (this.size[1] * 1.4), this.size[0], this.size[1])];
		this.players_buttons = [new Button("AI VS AI", canvas.width / 5 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
       			new Button("1 VS 1", canvas.width / 5 * 2 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
          		new Button("2 VS 2", canvas.width / 5 * 3 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
            	new Button("1V1V1V1", canvas.width / 5 * 4 - (this.mod_size[0] / 2), canvas.height / 4 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1])];
		this.mod_buttons = [new Button("LOCAL", canvas.width / 5 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
              	new Button("ONLINE", canvas.width / 5 * 2 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
          		new Button("BORDERLESS", canvas.width / 5 * 3 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1]),
            	new Button("OBSTACLE", canvas.width / 5 * 4 - (this.mod_size[0] / 2), canvas.height / 2 - (this.mod_size[1] / 2), this.mod_size[0], this.mod_size[1])];
		this.param_buttons = [new Button("-", canvas.width * 0.415, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.435, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("-", canvas.width * 0.755, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03),
				new Button("+", canvas.width * 0.775, canvas.height / 4 * 3 - (canvas.height * 0.025), canvas.width * 0.015, canvas.height * 0.03)];
		this.players_buttons[1].highlight = true;
		this.mod_buttons[0].highlight = true;
	}
}