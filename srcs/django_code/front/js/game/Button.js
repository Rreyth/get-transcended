import { canvas, ctx, roundRect } from './canvas.js';
import { Hitbox } from './Hitbox.js';

export class Button {
	constructor(name, x, y, width, height, square = false) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.hitbox = new Hitbox(x, y, width, height);
		this.highlight = false;
		this.square = square;
	}

	draw() {
		const x = this.x * canvas.width;
		const y = this.y * canvas.height;
		const width = this.width * canvas.width;
		const height = this.height * canvas.height;
		this.hitbox.pos.x = x;
		this.hitbox.pos.y = y;
		// this.hitbox.pos = [x, y];
		this.hitbox.size = [width, height];

		if (this.highlight) {
			ctx.fillStyle = "rgb(130, 130, 130)";
			if (!this.square)
				roundRect(ctx, x, y, width, height, Math.floor(height * 0.25)).fill();
			else
				ctx.fillRect(x, y, width, height);
			ctx.fillStyle = "white";
		}
		if (!this.square)
			roundRect(ctx, x, y, width, height, Math.floor(height * 0.25)).stroke();
		else
			ctx.strokeRect(x, y, width, height);
		if (this.name == "+" || this.name == "-")
			ctx.fillText(this.name, x + width * 0.49, y + height * 0.745);
		else
			ctx.fillText(this.name, x + width / 2, y + height * 0.6);
	}
}
