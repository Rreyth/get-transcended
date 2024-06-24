import { Vec2, dotProduct } from "./Vec2.js";
import { canvas, ctx, ctx_circle } from "./canvas.js";
import { try_collide } from "./Ball.js"

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
		if ((Date.now() / 1000) - this.start >= 3.5)
			this.solid = true;
	}

	collide(ball) {
		let rad = ball.dir * Math.PI / 180;
		let dir = new Vec2(Math.cos(rad), Math.sin(rad));
		let norm = ball.center[0].sub(this.center);
		norm.normalize();
		norm.scale(dotProduct(dir, norm) * 2);
		const res = dir.sub(norm);

		this.unstuckBall(ball, rad);

		rad = Math.atan2(res.y, res.x);
		ball.dir = rad * (180 / Math.PI);
	}

	unstuckBall(ball, rad) {
		while (try_collide(ball.center[0].x, ball.center[0].y, ball.radius, [], false, this, ball.ai_hitbox)) {
			ball.center[0].x -= (Math.cos(rad) * 1);
			ball.center[0].y -= (Math.sin(rad) * 1);
		}
	}

	responsive() {
		this.radius = Math.floor(canvas.height * 0.193);
		this.center = new Vec2(canvas.width / 2, canvas.height / 2);
	}
}