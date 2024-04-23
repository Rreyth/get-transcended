import { Button } from "./Button.js";
import { canvas, ctx } from "./canvas.js";

export class StartScreen {
	constructor(mode, online = false, square = false, nb_players = 2) {
		this.mode = mode;
		this.online = online;
		this.square = square;
		this.nb_players = nb_players;
		this.timer = 300;
		this.time = Date.now() / 1000;
		this.size = [canvas.width * 0.1, canvas.height * 0.1];
		this.player_input = {};
		if (mode === "LOCAL" || (mode === "custom" && nb_players == 2 && !online)) {
			this.player_input[1] = [new Button("W", (canvas.width / 4) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 4) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("SPACE", (canvas.width / 4) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 4 * 3) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 4 * 3) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", (canvas.width / 4 * 3) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])];
		}
		else if (mode != "custom") {
			this.player_input[1] = [new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("SPACE", (canvas.width / 5) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
			if (online) {
				this.player_input[2] = [new Button("UP", (canvas.width / 5 * 4) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 5 * 4) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("SPACE", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
			}
		}
		else {
			if (online) {
				if (!square) {
					this.player_input = {1 : [new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 5) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])]};
					if (nb_players == 4)
						this.player_input[2] = this.player_input[1];
					else {
						this.player_input[2] = [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					}
					this.player_input[3] = [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					this.player_input[4] = this.player_input[3];
				}
				else {
					this.player_input = {1 : [new Button("Space", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							2 : [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							3 : [new Button("LEFT", (canvas.width / 3) - (this.size[0] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("RIGHT", (canvas.width / 2) - (this.size[0] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 3 * 2) - (this.size[1] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])],
							4 : [new Button("LEFT", (canvas.width / 3) - (this.size[0] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("RIGHT", (canvas.width / 2) - (this.size[0] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 3 * 2) - (this.size[1] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])]};
				}
			}
			else {
				if (!square) {
					this.player_input = {1 : [new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 5) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])]};
					if (nb_players == 4) {
						this.player_input[2] = [new Button("T", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("G", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					}
					else {
						this.player_input[2] = [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					}
					this.player_input[3] = [new Button("NUM8", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM5", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])];

					this.player_input[4] = [new Button("UP", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
				}
				else {
					this.player_input = {1 : [new Button("Space", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							2 : [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							3 : [new Button("T", (canvas.width / 2) - (this.size[0] * 1.7), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Y", (canvas.width / 2) - (this.size[0] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("H", (canvas.width / 2) + (this.size[0] * 0.7), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])],
							4 : [new Button("K", (canvas.width / 2) - (this.size[0] * 1.7), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("L", (canvas.width / 2) - (this.size[0] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("O", (canvas.width / 2) + (this.size[0] * 0.7), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])]};
				}
			}
		}
	}
	
	draw(player_id) {
		if (this.online) {
			for (const key in this.player_input) {
				if (parseInt(key) === player_id) {
					for (let button of this.player_input[key])
						button.draw();
					break;
				}
			}
		}
		else {
			for (const key in this.player_input) {
				for (let button of this.player_input[key])
					button.draw();
			}
		}
		ctx.fillText(this.timer, canvas.width / 2, canvas.height / 2);
	}

	update() {
		const tmp = Date.now() / 1000;
		const delta = tmp - this.time;
		if (delta >= 1) {
			this.time = tmp;
			this.timer -= 1;
		}
	}

	responsive() {
		this.size = [canvas.width * 0.1, canvas.height * 0.1];
		this.player_input = {};
		if (this.mode === "LOCAL" || (this.mode === "custom" && this.nb_players == 2 && !this.online)) {
			this.player_input[1] = [new Button("W", (canvas.width / 4) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 4) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("SPACE", (canvas.width / 4) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 4 * 3) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 4 * 3) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", (canvas.width / 4 * 3) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])];
		}
		else if (this.mode != "custom") {
			this.player_input[1] = [new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("SPACE", (canvas.width / 5) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
			if (this.online) {
				this.player_input[2] = [new Button("UP", (canvas.width / 5 * 4) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 5 * 4) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("SPACE", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
			}
		}
		else {
			if (this.online) {
				if (!this.square) {
					this.player_input = {1 : [new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 5) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])]};
					if (this.nb_players == 4)
						this.player_input[2] = this.player_input[1];
					else {
						this.player_input[2] = [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					}
					this.player_input[3] = [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					this.player_input[4] = this.player_input[3];
				}
				else {
					this.player_input = {1 : [new Button("Space", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("UP", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							2 : [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							3 : [new Button("LEFT", (canvas.width / 3) - (this.size[0] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("RIGHT", (canvas.width / 2) - (this.size[0] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 3 * 2) - (this.size[1] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])],
							4 : [new Button("LEFT", (canvas.width / 3) - (this.size[0] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("RIGHT", (canvas.width / 2) - (this.size[0] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 3 * 2) - (this.size[1] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])]};
				}
			}
			else {
				if (!this.square) {
					this.player_input = {1 : [new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Space", (canvas.width / 5) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])]};
					if (this.nb_players == 4) {
						this.player_input[2] = [new Button("T", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("G", (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					}
					else {
						this.player_input[2] = [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])];
					}
					this.player_input[3] = [new Button("NUM8", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM5", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", canvas.width - (canvas.width / 4 + this.size[0]) + (this.size[0] * 0.275), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])];

					this.player_input[4] = [new Button("UP", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 4 + this.size[0]) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])];
				}
				else {
					this.player_input = {1 : [new Button("Space", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("W", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("S", (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							2 : [new Button("UP", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("DOWN", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 2) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("NUM0", canvas.width - (canvas.width / 5) - (this.size[0] / 2), (canvas.height / 3 * 2) - (this.size[1] / 2), this.size[0], this.size[1])],
							3 : [new Button("T", (canvas.width / 2) - (this.size[0] * 1.7), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("Y", (canvas.width / 2) - (this.size[0] / 2), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("H", (canvas.width / 2) + (this.size[0] * 0.7), (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])],
							4 : [new Button("K", (canvas.width / 2) - (this.size[0] * 1.7), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("L", (canvas.width / 2) - (this.size[0] / 2), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1]),
							new Button("O", (canvas.width / 2) + (this.size[0] * 0.7), canvas.height - (canvas.height / 5) - (this.size[1] / 2), this.size[0], this.size[1])]};
				}
			}
		}
	}
}