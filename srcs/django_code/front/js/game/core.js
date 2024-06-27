import * as input from './input_handler.js';
import { update_all } from './update.js';
import * as render from './render.js';
import { Menu } from './Menu.js';
import { Pause } from './Pause.js';
import { End } from './End.js';
import { canvas } from './canvas.js';

export class Game {
	constructor() {
		this.alias = "ALIAS";
	}

	start(websocket) {
		this.start_screen = false;
		this.wait_screen = false;
		this.custom_menu = false;
		this.GameRoom = false;
		this.players = false;
		this.online = false;
		this.state = "menu";
		this.mode = "none";
		this.max_score = 5;
		this.id = 1;
		this.pressed = [];
		this.customs = [];
		this.inputs = {};
		this.ai = [];
		this.pause = [false, new Pause()];
		this.menu = new Menu();
		this.end = new End();
		this.last = Date.now() / 1000;
		this.GameHub = websocket;
	}

	endMsg(reason = "end") {
		let msg = {"type" : "endGame"};
		msg["mode"] = (this.customs) ? "custom" : "QuickGame";
		msg["match"] = [];
		for (let player of this.players){
			msg["match"].push({'id' : player.nb, 'username' : player.name, 'score' : player.score, 'win' : (player.win === "WIN")});
		}

		msg["online"] = false;
		msg["customs"] = this.customs;
		msg["score"] = this.max_score;
		msg["reason"] = reason;
		return msg;
	}

	keyboard_input() {
		if (this.inputs["Escape"])
			input.escape_handler(this);
		if (this.state === "menu" && this.menu.buttons[5].highlight)
			input.input_id(this, this.menu.buttons[5], this.inputs);
		else if (this.state === "tournament names")
			this.tournament_names.input(this.inputs);
		else
			input.input_handler(this, this.inputs);
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
		this.GameRoom.send(JSON.stringify(msg));
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
		else if (this.state === "tournament menu" || this.state === "tournament" || this.state === "tournament names")
			render.tournament(this);
	}
}