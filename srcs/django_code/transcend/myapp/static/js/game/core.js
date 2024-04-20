import * as input from './input_handler.js';
import { update_all } from './update.js';
import * as render from './render.js';
import { Menu } from './Menu.js';
import { Pause } from './Pause.js';
import { End } from './End.js';
import { canvas } from './canvas.js';

export class Game {
	constructor() {
		this.state = "menu";
		this.mode = "none";
		this.menu = new Menu();
		this.pause = [false, new Pause()];
		this.end = new End();
		this.players = false;
		this.alias = "ALIAS";
	}

	start(websocket) {
		this.max_score = 10;
		this.ai = [];
		this.pressed = [];
		this.online = false;
		this.id = 1;
		this.GameRoom = false;
		this.GameHub = websocket;
		this.last = Date.now() / 1000;
		this.wait_screen = false;
		this.start_screen = false;
	}

	endMsg(reason = "end") {
		let msg = {"type" : "endGame"};
		if (this.players) {
			msg["score"] = this.players.map(player => player.score);
			msg["win"] = this.players.map(player => player.win);
		}
		msg["reason"] = reason;
		return msg;
	}

	keyboard_input = (event) => {
		const key = event.key;
		if (key === "Escape")
			input.escape_handler(this);
		else if (this.state === "menu" && this.menu.buttons[5].highlight)
			input.input_id(this, this.menu.buttons[5], key);
		else
			input.input_handler(this, key);
	}

	mouse_input = (event) => {
		const rect = canvas.getBoundingClientRect();
		const pos = [event.clientX - rect.left, event.clientY - rect.top];
		input.mouse_handler(this, pos);
	}

	tick() {
		const tmp = Date.now() / 1000;
		let delta = tmp - this.last;
		this.last = tmp;

		if (this.online)
			this.sendInputs();
		update_all(this, delta);
	}

	sendInputs() {
		if (this.pressed.length == 0)
			return;
		let msg = {"type" : "input",
					"player" : this.id,
					"inputs" : this.pressed};

		//send //py : GameRoom.send(json.dumps(msg))
		this.pressed = [];
	}

	render() {
		if (this.state === "waiting")
			render.render_wait(this);
		else if (this.state === "start")
			render.render_start(this);
		else if (this.state === "end")
			render.render_end(this);
		else if (this.state === "menu")
			render.render_menu(this);
		else if (this.state === "custom")
			render.render_custom(this);
		else if (this.pause[0])
			render.render_pause(this);
		else if (this.state === "game")
			render.render_game(this);
	}
}