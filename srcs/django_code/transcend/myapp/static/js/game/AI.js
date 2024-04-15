import { Vec2 } from './Vec2.js'
import { Hitbox, is_colliding } from './Hitbox.js'
import { canvas } from './canvas.js';

export class AI {
	constructor(player) {
		this.id = player.nb;
		this.side = player.side;
		this.size = player.size;
		this.time = 0;
		this.pos = new Vec2(pos=player.paddle[0].pos);
		this.center = new Vec2(pos=this.pos);
		this.target = new Vec2(pos=this.pos);
		this.moves = [];
		if (this.side === "left" || this.side === "right")
			self.hitbox = new Hitbox({pos: new Vec2(self.pos.x - 1, 0), width: player.size[0] + 2, height: canvas.height})
		else
			self.hitbox = new Hitbox({pos: new Vec2(0, self.pos.y - 1), width: canvas.width, height: player.size[1] + 2})
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
			if (self.target.notEqual(this.pos))
				self.move();
		}
	}

	predict(core, delta) {
		const sec_to_predict = 5;

		let ball_cpy = core.ball.copy(this.hitbox);

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
			this.target = new Vec2(pos=this.center);

		if (is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], this.pos, this.size))
			this.target = new Vec2(pos=this.pos);
		else if (this.target != this.center || (this.target == this.center && collided)) {
			if (this.side === "left" || this.side === "right")
				this.target.y += randHit(self.size[1]);
			else
				this.target.x += randHit(self.size[0]);
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
}

function randHit(size) {
	const max = size / 2 - (size * 0.05);
	const min = -max;
	return Math.floor(Math.random() * (max - min + 1) + min);
}