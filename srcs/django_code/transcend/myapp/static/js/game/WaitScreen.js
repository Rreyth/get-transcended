import { Button } from "./Button.js";
import { canvas, ctx } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";
import { Vec2 } from "./Vec2.js";

export class WaitScreen {
	constructor(id, nb, nb_players, mode) {
		this.mode = mode;
		this.id = id;
		this.nb = nb;
		this.nb_max = nb_players;
		this.size = [canvas.width * 0.2, canvas.height * 0.1];
		this.button = new Button("BACK TO MENU", canvas.width / 2 - this.size[0] / 2, canvas.height - this.size[1] * 1.5, this.size[0], this.size[1]);
	}

	draw() {
		this.button.draw();
		ctx.fillText("WAITING FOR PLAYERS", canvas.width / 2, this.size[1]);
		ctx.fillText("ID : " + this.id, canvas.width * 0.06, this.size[1]);
		ctx.fillText(this.nb + " / " + this.nb_max, canvas.width / 2, this.size[1] * 2.5);
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		if (is_colliding(pos, [0, 0], this.button.hitbox.pos, this.size)) {
			core.state = "menu";
			core.mode = "none"
			if (core.GameRoom)
				core.GameRoom.send(JSON.stringify({'type' : 'quitGame', 'id' : core.id, 'cmd' : 'quitWait'}));
			else
				core.GameHub.send(JSON.stringify({'type' : 'quitGame', 'id' : core.id, 'cmd' : 'quitWait'}));
		}
	}
}