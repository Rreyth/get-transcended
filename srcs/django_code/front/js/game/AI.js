import { Vec2 } from './Vec2.js'
import { Hitbox, is_colliding } from './Hitbox.js'
import { canvas } from './canvas.js';

export class AI {
	constructor(player) {
		this.id = player.nb;
		this.side = player.side;
		this.size = player.size;
		this.time = 0;
		this.pos = new Vec2(player.paddle[0].pos.x, player.paddle[0].pos.y);
		this.center = new Vec2(this.pos.x, this.pos.y);
		this.target = new Vec2(this.pos.x, this.pos.y);
		this.moves = [];
		if (this.side === "left" || this.side === "right")
			this.hitbox = new Hitbox(this.pos.x - 1, 0, player.size[0] + 2,  canvas.height)
		else
			this.hitbox = new Hitbox(0, this.pos.y - 1, canvas.width, player.size[1] + 2)
	}

	update(core, core_delta) {
		if (core.ball.stick === this.id)
			this.moves.push("LAUNCH");
		else {
			const tmp = Date.now() / 1000;
			const delta = tmp - this.time;
			if (delta >= 1) {
				this.predict(core, core_delta);
				this.time = tmp;
			}
			if (this.target.notEqual(this.pos))
				this.move();
		}
		if (this.target.notEqual(this.pos))
			if (this.closeEnough())
				this.target = new Vec2(this.pos.x, this.pos.y);
	}

	predict(core, delta) {
		const sec_to_predict = 5;

		let ball_cpy = core.ball.copy(this.hitbox);
		let ball_box = new Vec2(ball_cpy.center[0].x - ball_cpy.radius, ball_cpy.center[0].y - ball_cpy.radius);
		let collided = false;
		for (let i = 0; i < sec_to_predict * 100; i++) {
			ball_cpy.update(core, delta);
			ball_box = new Vec2(ball_cpy.center[0].x - ball_cpy.radius, ball_cpy.center[0].y - ball_cpy.radius);
			if (is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], this.hitbox.pos, this.hitbox.size)) {
				collided = true;
				if (is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], this.pos, this.size))
					break;
				if (this.side === "left" || this.side === "right")
					this.target.y = ball_cpy.center[0].y - (this.size[1] / 2);
				else
					this.target.x = ball_cpy.center[0].x - (this.size[0] / 2);
				break;
			}
		}
		if (!collided)
			this.target = new Vec2(this.center.x, this.center.y);

		if (is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], this.pos, this.size))
			this.target = new Vec2(this.pos.x, this.pos.y);
		else if (this.target.notEqual(this.center) || (this.target.equal(this.center) && collided)) {
			if (this.side === "left" || this.side === "right")
				this.target.y += randHit(this.size[1]);
			else
				this.target.x += randHit(this.size[0]);
		}
	}

	move() {
		if (this.target.x < this.pos.x)
			this.moves.push("LEFT");
		else if (this.target.x > this.pos.x)
			this.moves.push("RIGHT");
		else if (this.target.y < this.pos.y)
			this.moves.push("UP");
		else if (this.target.y > this.pos.y)
			this.moves.push("DOWN");
	}

	responsive(players, old_sizes) {
		for (let player of players) {
			if (this.id == player.nb) {
				this.size = player.size;
				this.pos = new Vec2(player.paddle[0].pos.x, player.paddle[0].pos.y);
				break;
			}
		}
		let pos_ratio = [this.center.x / old_sizes[0], this.center.y / old_sizes[1]];
		this.center = new Vec2(pos_ratio[0] * canvas.width, pos_ratio[1] * canvas.height);
		pos_ratio = [this.target.x / old_sizes[0], this.target.y / old_sizes[1]];
		this.target = new Vec2(pos_ratio[0] * canvas.width, pos_ratio[1] * canvas.height);
		if (this.side === "left" || this.side === "right")
			this.hitbox = new Hitbox(this.pos.x - 1, 0, this.size[0] + 2,  canvas.height)
		else
			this.hitbox = new Hitbox(0, this.pos.y - 1, canvas.width, this.size[1] + 2)
	}

	closeEnough() {
		if (this.side === "left" || this.side === "right") {
			if (Math.abs(this.target.y - this.pos.y) < (this.size[1] * 0.05))
				return true;
		}
		else {
			if (Math.abs(this.target.x - this.pos.x) < (this.size[0] * 0.05))
				return true;
		}
		return false;
	}
}

function randHit(size) {
	const max = size / 2 - (size * 0.07);
	const min = -max;
	return Math.floor(Math.random() * (max - min + 1) + min);
}