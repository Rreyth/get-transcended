import { Button } from "./Button.js";
import { canvas, ctx } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";
import { Vec2 } from "./Vec2.js";

export class Pause {
	constructor() {
		this.freeze = false;
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.buttons = [new Button("RESUME", canvas.width / 2 - this.size[0] / 2, canvas.height / 2 - this.size[1] / 2, this.size[0], this.size[1]),
			new Button("BACK TO MENU", canvas.width / 2 - this.size[0] / 2, (canvas.height / 3 * 2) - this.size[1] / 2, this.size[0], this.size[1])];
	}

	draw() {
		for (let b of this.buttons)
			b.draw();

		ctx.font = Math.floor(canvas.height / 3) + "px 'pong-teko'";
		ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 4);
		ctx.font = Math.floor(canvas.height * 0.085) + "px 'pong-teko'";
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		for (let b of this.buttons) {
			if (is_colliding(pos, [0, 0], b.hitbox.pos, this.size)) {
				if (b.name === "BACK TO MENU") {
					core.state = "menu";
					core.mode = "none";
					if (!core.online) {
						core.GameHub.send(JSON.stringify(core.endMsg("quit")));
						core.ai = [];
						core.max_score = 10;
					}
					else
						core.GameRoom.send(JSON.stringify({'type' : 'quitGame', 'id' : core.id}));
					core.online = false;
					core.wait_screen = false;
					core.start_screen = false;
				}
				core.pause[0] = false;
				this.freeze = false;
			}
		}
	}
}