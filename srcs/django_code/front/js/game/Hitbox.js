import { Vec2 } from './Vec2.js'

export class Hitbox {
	constructor(x, y, width, height) {
		this.pos = new Vec2(x, y);
		this.size = [width, height];
	}

	collideWall(ball, pos) {
		let rad = ball.dir * Math.PI / 180;
		let dir = new Vec2(Math.cos(rad), Math.sin(rad));

		if (pos === "up" || pos === "down")
			dir.y = -dir.y;
		else
			dir.x = -dir.x;

		let ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
		while (is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], this.pos, this.size)) {
			if (pos === "up")
				ball.center[0].y += 1;
			else if (pos === "down")
				ball.center[0].y -= 1;
			else if (pos === "left")
				ball.center[0].x += 1;
			else
				ball.center[0].x -= 1;

			ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
		}

		rad = Math.atan2(dir.y, dir.x);
		ball.dir = rad * (180 / Math.PI);
	}

	collidePaddle(ball, nb) {
		let diff_x = (ball.center[0].x - (this.pos.x + (this.size[0] / 2))) / (this.size[0] / 2);
		const tmp = diff_x;
		if (diff_x > 1 || diff_x < -1)
			diff_x = (diff_x > 0) ? diff_x % 1 : diff_x % -1;
		if (tmp !== diff_x && diff_x === 0)
			diff_x = (tmp > 0) ? 1 : -1;
		let diff_y = (ball.center[0].y - (this.pos.y + (this.size[1] / 2))) / (this.size[1] / 2);

		let ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
		const max = 45;
		if (diff_y >= 1) {
			ball.dir = (max * (-diff_x)) + 90;
			while (is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], this.pos, this.size)) {
				ball.center[0].y += 1;
				ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
			}
		}
		else if (diff_y <= -1) {
			ball.dir = (max * diff_x) + 270;
			while (is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], this.pos, this.size)) {
				ball.center[0].y -= 1;
				ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
			}
		}
		else if (diff_x >= 0) {
			ball.dir = max * diff_y;
			while (is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], this.pos, this.size)) {
				ball.center[0].x += 1;
				ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
			}
		}
		else {
			ball.dir = (max * (-diff_y)) + 180;
			while (is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], this.pos, this.size)) {
				ball.center[0].x -= 1;
				ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
			}
		}
		if (ball.multiplier < 5)
			ball.multiplier += 0.1;
		ball.last_hit = nb;
	}
}

/**
 * 
 * @param {Vec2} obj1 - pos Vec2 of the first object
 * @param {Array} obj1_size - size of the first object
 * @param {Vec2} obj2 - pos Vec2 of the second object
 * @param {Array} obj2_size - size of the second object
 * @returns {boolean} - true if the two objects are colliding
 */
export function is_colliding(obj1, obj1_size, obj2, obj2_size) {
	return (obj1.x + obj1_size[0] >= obj2.x && obj1.x <= obj2.x + obj2_size[0] &&
		obj1.y + obj1_size[1] >= obj2.y && obj1.y <= obj2.y + obj2_size[1]);
}