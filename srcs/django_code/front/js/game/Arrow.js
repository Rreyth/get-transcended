import { Button } from "./Button.js";
import { ctx } from "./canvas.js";

export class Arrow extends Button {
	constructor(name, x, y, width, height, dir) {
		super(name, x, y, width, height, false);
		this.dir = dir;
	}

	draw() {
		let pos = [];
		if (this.dir === "up") {
			pos = [[this.x, this.y + this.height], [this.x + (this.width / 2), this.y], [this.x + this.width, this.y + this.height]];
		}
		else {
			pos = [[this.x, this.y], [this.x + (this.width / 2), this.y + this.height], [this.x + this.width, this.y]];
		}
		ctx.beginPath();
		ctx.moveTo(pos[0][0], pos[0][1]);
		ctx.lineTo(pos[1][0], pos[1][1]);
		ctx.lineTo(pos[2][0], pos[2][1]);
		ctx.closePath();
		ctx.fill();
	}
}