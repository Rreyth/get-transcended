import { Vec2, dotProduct } from "./Vec2.js";
import { canvas, ctx, ctx_circle } from "./canvas.js";

export class Obstacle {
	constructor() {
		this.center = new Vec2(canvas.width / 2, canvas.height / 2);
		this.radius = Math.floor(canvas.height * 0.193);
		this.solid = false;
		this.start = Date.now() / 1000;
	}

	draw() {
		ctx_circle(ctx, this.center.x, this.center.y, this.radius).fill();
	}

	update() {
		if (this.solid)
			return;
		if ((Date.now() / 1000) - this.start >= 4)
			this.solid = true;
	}

	collide(ball) {
		let rad = ball.dir * Math.PI / 180;
		let dir = new Vec2(Math.cos(rad), Math.sin(rad));
		let norm = ball.center[0].sub(this.center).normalize();
		norm.scale(dotProduct(dir, norm) * 2);
		const res = dir.sub(norm);
		rad = Math.atan2(res.y, res.x);
		ball.dir = rad * (180 / Math.PI);
	}
}