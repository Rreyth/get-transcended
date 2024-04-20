import { canvas, ctx } from "./canvas.js";
import { Player } from "./Player.js";
import { Wall } from "./Wall.js";
import { Ball } from "./Ball.js";
import { StartScreen } from "./StartScreen.js";
import { WaitScreen } from "./WaitScreen.js";
import { Pause } from "./Pause.js";
import { AI } from "./AI.js";
import { CustomMenu } from "./Custom.js";
import { Button } from "./Button.js";
import { Vec2 } from "./Vec2.js";
import { is_colliding } from "./Hitbox.js";

export class Menu {
	constructor() {
		this.button_size = [canvas.width * 0.1, canvas.height * 0.1];
		this.buttons = [new Button("SOLO", (canvas.width / 3) - (this.button_size[0] / 2), (canvas.height / 2) - this.button_size[1], this.button_size[0], this.button_size[1]),
				  new Button("LOCAL", (canvas.width / 3 * 2) - (this.button_size[0] / 2), (canvas.height / 2) - this.button_size[1], this.button_size[0], this.button_size[1]),
				  new Button("ONLINE", (canvas.width / 3) - (this.button_size[0] / 2), (canvas.height / 3 * 2), this.button_size[0], this.button_size[1]),
				  new Button("CUSTOM", (canvas.width / 3 * 2) - (this.button_size[0] / 2), (canvas.height / 3 * 2), this.button_size[0], this.button_size[1]),
				  new Button("JOIN", (canvas.width * 0.01), (canvas.height * 0.875), this.button_size[0], this.button_size[1]),
				  new Button("", (canvas.width * 0.12), (canvas.height * 0.875), this.button_size[0], this.button_size[1])];
		this.err = false;
	}

	draw() {
		ctx.font = Math.floor(canvas.height / 3) + "px pong-teko";
		ctx.fillText("PONG", canvas.width / 2, canvas.height / 4);
		ctx.font = Math.floor(canvas.height * 0.05) + "px pong-teko";
		if (this.err) {
			ctx.fillStyle = "rgb(255, 102, 102)";
			ctx.fillText(this.err, this.buttons[5].x + this.button_size[0] * 1.7, this.buttons[5].y + this.button_size[1] * 0.55);
			ctx.fillStyle = "white";
		}
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		for (let b of this.buttons)
			b.draw();
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		for (let b of this.buttons)
			if (is_colliding(pos, [0, 0], b.hitbox.pos, this.button_size))
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
			// await core.GameHub.send(json.dumps({'type' : 'join', 'id' : self.buttons[5].name}))
			// response : dict = json.loads(await core.GameHub.recv())
			if (response['success'] == 'false')
				this.err = "Room " + this.buttons[5].name + " doesn't exist";
			else {
				// core.GameSocket = response['socket']
				room_id = this.buttons[5].name;
				core.id = response['pos'];
				core.state = "waiting";
				core.mode = "ONLINE";
				core.online = true;
				wait_nb = response['max'];
				core.custom_mod = (response['custom_mods'].includes("1V1V1V1")) ? "1V1V1V1" : false;
				core.start_screen = new StartScreen(response['mode'], core.online, response['custom_mods'].includes("1V1V1V1"), wait_nb);
			}
		}
		if (name === this.buttons[5].name)
			this.buttons[5].highlight = !this.buttons[5].highlight;
		if (name === "LOCAL") {
			// msg = {"type" : "quickGame", "cmd" : "join", "online" : "false"}
			// await core.GameHub.send(json.dumps(msg))
			core.players = [new Player(1, core.alias + "1", 2, false, false), new Player(2, core.alias + "2", 2, false, false)];
			core.walls = [new Wall("up", false), new Wall("down", false)];
			core.ball = new Ball(false);
			core.state = "start";
			core.mode = "LOCAL";
		}
		if (name === "SOLO") {
			// msg = {"type" : "quickGame", "cmd" : "join", "online" : "false"}
			// await core.GameHub.send(json.dumps(msg))
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
			// msg = {"type" : "quickGame", "cmd" : "join", "online" : "true"}
			// await core.GameHub.send(json.dumps(msg))
			// response : dict = json.loads(await core.GameHub.recv())
			if ("socket" in response) {
				core.GameSocket = response['socket'];
				room_id = response['ID'];
				core.mode = "ONLINE";
				core.state = "waiting";
				core.id = response['pos'];
			}
			core.online = true;
			wait_nb = 2;
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
}