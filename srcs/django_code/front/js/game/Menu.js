import { canvas, ctx } from "./canvas.js";
import { Player } from "./Player.js";
import { Wall } from "./Wall.js";
import { Ball } from "./Ball.js";
import { StartScreen } from "./StartScreen.js";
import { WaitScreen } from "./WaitScreen.js";
import { AI } from "./AI.js";
import { CustomMenu } from "./Custom.js";
import { Button } from "./Button.js";
import { Vec2 } from "./Vec2.js";
import { is_colliding } from "./Hitbox.js";
import { TournamentMenu } from "./TournamentMenu.js";

export class Menu {
	constructor() {
		this.button_size = [canvas.width * 0.1, canvas.height * 0.1];
		this.buttons = [new Button("SOLO", (canvas.width / 3) - (this.button_size[0] / 2), (canvas.height / 2) - this.button_size[1], this.button_size[0], this.button_size[1]),
					new Button("LOCAL", (canvas.width / 3 * 2) - (this.button_size[0] / 2), (canvas.height / 2) - this.button_size[1], this.button_size[0], this.button_size[1]),
					new Button("ONLINE", (canvas.width / 3) - (this.button_size[0] / 2), (canvas.height / 3 * 2), this.button_size[0], this.button_size[1]),
					new Button("CUSTOM", (canvas.width / 3 * 2) - (this.button_size[0] / 2), (canvas.height / 3 * 2), this.button_size[0], this.button_size[1]),
					new Button("JOIN", (canvas.width * 0.01), (canvas.height * 0.875), this.button_size[0], this.button_size[1]),
					new Button("", (canvas.width * 0.12), (canvas.height * 0.875), this.button_size[0], this.button_size[1]),
					new Button("TOURNAMENT", (canvas.width * 0.815), (canvas.height * 0.875), this.button_size[0] * 1.75, this.button_size[1])];
		this.err = false;
	}

	draw() {
		ctx.font = Math.floor(canvas.height / 3) + "px pong-teko";
		ctx.fillText("PONG", canvas.width / 2, canvas.height / 4);
		ctx.font = Math.floor(canvas.height * 0.05) + "px pong-teko";
		if (this.err) {
			ctx.fillStyle = "rgb(255, 102, 102)";
			let pos = this.err.length * 0.005
			ctx.fillText(this.err, this.buttons[5].x + this.button_size[0] + canvas.width * pos, this.buttons[5].y + this.button_size[1] * 0.55);
			ctx.fillStyle = "white";
		}
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		for (let b of this.buttons)
			b.draw();
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		for (let b of this.buttons)
			if (is_colliding(pos, [0, 0], b.hitbox.pos, [b.width, b.height]))
				this.setValues(b.name, core);
	}

	setValues(name, core) {
		core.custom_mod = false;
		core.obstacle = false;
		if (name === "JOIN") {
			if (this.buttons[5].name.length === 0) {
				this.err = "Room id is empty";
				return;
			}
			core.GameHub.send(JSON.stringify({'type' : 'join', 'id' : this.buttons[5].name}));
		}
		if (name === this.buttons[5].name)
			this.buttons[5].highlight = !this.buttons[5].highlight;
		if (name === "LOCAL") {
			const msg = {"type" : "quickGame", "cmd" : "join", "online" : "false"};
			core.GameHub.send(JSON.stringify(msg));
			core.players = [new Player(1, core.alias + "1", 2, false, false), new Player(2, core.alias + "2", 2, false, false)];
			core.walls = [new Wall("up", false), new Wall("down", false)];
			core.ball = new Ball(false);
			core.state = "start";
			core.mode = "LOCAL";
		}
		if (name === "SOLO") {
			const msg = {"type" : "quickGame", "cmd" : "join", "online" : "false"};
			core.GameHub.send(JSON.stringify(msg));
			core.players = [new Player(1, core.alias, 2, false, false), new Player(2, "AI", 2, false, false)];
			core.ai.push(new AI(core.players[1]));
			core.walls = [new Wall("up", false), new Wall("down", false)];
			core.ball = new Ball(false);
			core.state = "start";
			core.mode = "solo";
		}
		if (name === "CUSTOM") {
			core.custom_menu = new CustomMenu();
			core.state = "custom";
		}
		if (name === "ONLINE") {
			const msg = {"type" : "quickGame", "cmd" : "join", "online" : "true"};
			core.GameHub.send(JSON.stringify(msg));
		}
		if (name === "TOURNAMENT") {
			core.tournament_menu = new TournamentMenu();
			core.state = "tournament menu";
		}
		if (core.mode != "none") {
			this.buttons[5].name = "";
			this.err = false;
			if (!core.start_screen)
				core.start_screen = new StartScreen(core.mode, core.online);
			if (core.online && !core.wait_screen)
				core.wait_screen = new WaitScreen(room_id, core.id, wait_nb, "QuickGame Online");
		}
	}

	responsive() {
		this.button_size = [canvas.width * 0.1, canvas.height * 0.1];
		this.buttons = [new Button("SOLO", (canvas.width / 3) - (this.button_size[0] / 2), (canvas.height / 2) - this.button_size[1], this.button_size[0], this.button_size[1]),
				  new Button("LOCAL", (canvas.width / 3 * 2) - (this.button_size[0] / 2), (canvas.height / 2) - this.button_size[1], this.button_size[0], this.button_size[1]),
				  new Button("ONLINE", (canvas.width / 3) - (this.button_size[0] / 2), (canvas.height / 3 * 2), this.button_size[0], this.button_size[1]),
				  new Button("CUSTOM", (canvas.width / 3 * 2) - (this.button_size[0] / 2), (canvas.height / 3 * 2), this.button_size[0], this.button_size[1]),
				  new Button("JOIN", (canvas.width * 0.01), (canvas.height * 0.875), this.button_size[0], this.button_size[1]),
				  new Button("", (canvas.width * 0.12), (canvas.height * 0.875), this.button_size[0], this.button_size[1]),
				  new Button("TOURNAMENT", (canvas.width * 0.815), (canvas.height * 0.875), this.button_size[0] * 1.75, this.button_size[1])];
	}
}