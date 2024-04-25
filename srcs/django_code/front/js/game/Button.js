import { ctx, roundRect } from './canvas.js';
import { Hitbox } from './Hitbox.js';

export class Button {
	constructor(name, x, y, width, height) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hitbox = new Hitbox(x, y, width, height);
		this.highlight = false;
	}

	draw() {
		if (this.highlight) {
			ctx.fillStyle = "rgb(130, 130, 130)";
			roundRect(ctx, this.x, this.y, this.width, this.height, Math.floor(this.height * 0.25)).fill();
			ctx.fillStyle = "white";
		}
		roundRect(ctx, this.x, this.y, this.width, this.height, Math.floor(this.height * 0.25)).stroke();
		if (this.name == "+" || this.name == "-")
			ctx.fillText(this.name, this.x + this.width * 0.49, this.y + this.height * 0.745);
		else
			ctx.fillText(this.name, this.x + this.width / 2, this.y + this.height * 0.6);
	}
}