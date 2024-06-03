import { canvas } from "./canvas.js";
import { Button } from "./Button.js";
import { Arrow } from "./Arrow.js";
import { Vec2 } from "./Vec2.js";
import { is_colliding } from "./Hitbox.js";

export class TournamentNames {
	constructor(players) {
		this.size = [canvas.width * 0.15, canvas.height * 0.1];
		this.gap = [canvas.width * 0.175, canvas.height * 0.15];
		this.init = [canvas.width * 0.25 - this.size[0], canvas.height * 0.25 - this.size[1]];
		this.pos = [this.init[0], this.init[1]];

		this.names = [];
		let j = 0;
		let i = 0;
		for (const player of players) {
			if (player.name == "AI")
				continue;
			this.names.push(new Button(player.name, this.init[0] + (this.gap[0] * i), this.init[1] + (this.gap[1] * j), this.size[0], this.size[1], true))
			i++;
			if (i == 4) {
				j++;
				i = 0;
			}
		}
		this.start_button = new Button("START", canvas.width * 0.83, canvas.height * 0.86, this.size[0], this.size[1]);
		if (this.names.length > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.01, canvas.height * 0.02, canvas.width * 0.05, canvas.height * 0.05, "up"),
					new Arrow("", canvas.width * 0.01, canvas.height * 0.93, canvas.width * 0.05, canvas.height * 0.05, "down")];
		}
	}

	draw() {
		for (const b of this.names) {
			b.draw();
		}
		this.start_button.draw();
		if (this.arrows) {
			for (const arrow of this.arrows) {
				arrow.draw();
			}
		}
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		for (let button of this.names) {
			if (is_colliding(pos, [0, 0], button.hitbox.pos, [button.width, button.height])) {
				if (!button.highlight) {
					for (let b of this.names)
						b.highlight = false;
					button.highlight = true;
				}
				else
					button.highlight = false;
				break;
			}
		}
		if (this.arrows) {
			for (let arrow of this.arrows) {
				if (is_colliding(pos, [0, 0], arrow.hitbox.pos, [arrow.width, arrow.height])) {
					this.scroll(arrow.dir);
					return;
				}
			}
		}
		if (is_colliding(pos, [0, 0], this.start_button.hitbox.pos, [this.start_button.width, this.start_button.height])) {
			for (let i = 0; i < this.names.length; i++) {
				core.players[i].name = this.names[i].name;
			}
			core.state = "tournament";
			core.tournament.initPlayers(core.players);
		}
	}

	scroll(dir) {
		if (this.names.length <= 20)
			return;
		let last_pos;
		if (this.names.length % 4 == 0)
			last_pos = this.pos[1] + (this.gap[1] * ((this.names.length / 4) - 1));
		else
			last_pos = this.pos[1] + (this.gap[1] * (this.names.length / 4));
		if (dir === "up" && this.pos[1] < this.init[1]) {
			this.pos[1] += canvas.height * 0.075;
		}
		else if (dir === "down" && last_pos > (canvas.height * 0.8)) {
			this.pos[1] -= canvas.height * 0.075;
		}

		let i = 0;
		let j = 0;
		for (let button of this.names) {
			button.x = this.pos[0] + (this.gap[0] * i);
			button.y = this.pos[1] + (this.gap[1] * j);
			button.hitbox.pos = new Vec2(button.x, button.y);
			i++;
			if (i == 4) {
				j++;
				i = 0;
			}
		}
	}

	input(inputs) {
		const set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (let button of this.names) {
			if (!button.highlight)
				continue;
			for (let key in inputs) {
				if (set.includes(key) && button.name.length < 9)
					button.name += key;
				else if (key == "Backspace")
					button.name = button.name.slice(0, -1);
				else if (key == "Enter")
					button.highlight = false;
				delete inputs[key];
			}
			break;
		}
	}

	responsive(old_sizes) {
		this.size = [canvas.width * 0.15, canvas.height * 0.1];
		this.gap = [canvas.width * 0.175, canvas.height * 0.15];
		this.init = [canvas.width * 0.25 - this.size[0], canvas.height * 0.25 - this.size[1]];
		const tmp = [this.pos[0] / old_sizes[0], this.pos[1] / old_sizes[1]];
		this.pos = [tmp[0] * canvas.width, tmp[1] * canvas.height];

		let i = 0;
		let j = 0;
		for (let button of this.names) {
			button.x = this.pos[0] + (this.gap[0] * i);
			button.y = this.pos[1] + (this.gap[1] * j);
			button.hitbox.pos = new Vec2(button.x, button.y);
			button.width = this.size[0];
			button.height = this.size[1];
			button.hitbox.size = [this.size[0], this.size[1]];
			i++;
			if (i == 4) {
				j++;
				i = 0;
			}
		}
		this.start_button = new Button("START", canvas.width * 0.83, canvas.height * 0.86, this.size[0], this.size[1]);
		if (this.names.length > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.01, canvas.height * 0.02, canvas.width * 0.05, canvas.height * 0.05, "up"),
					new Arrow("", canvas.width * 0.01, canvas.height * 0.93, canvas.width * 0.05, canvas.height * 0.05, "down")];
		}
	}
}
