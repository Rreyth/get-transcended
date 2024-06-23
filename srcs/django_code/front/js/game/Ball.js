import { Vec2, getDist } from "./Vec2.js";
import { canvas, ctx, ctx_circle } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";

export class Ball {
	constructor(borderless) {
		this.speed_per_sec = canvas.width / 3;
		this.speed = this.speed_per_sec * 0.01;
		this.ai_hitbox = false;
		this.borderless = borderless;
		this.radius = Math.floor(canvas.height * 0.01);
		this.center = [new Vec2(canvas.width / 2, canvas.height / 2)];
		if (borderless) {
			this.center.push(new Vec2(this.center[0].x, this.center[0].y + canvas.height));
			this.center.push(new Vec2(this.center[0].x, this.center[0].y - canvas.height));
		}

		this.stick = 0;
		this.side = "none";
		this.launch();
	}

	copy(ai_hitbox = false) {
		let ball = new Ball(this.borderless);
		ball.center = [new Vec2(this.center[0].x, this.center[0].y)];
		if (this.borderless) {
			ball.center.push(new Vec2(this.center[1].x, this.center[1].y));
			ball.center.push(new Vec2(this.center[2].x, this.center[2].y));
		}
		ball.stick = this.stick;
		ball.side = this.side;
		ball.dir = this.dir;
		ball.multiplier = this.multiplier;
		ball.last_hit = this.last_hit;
		ball.ai_hitbox = ai_hitbox;
		return ball;
	}

	move(players, walls, obstacle) {
		if (this.stick != 0) {
			for (let player of players) {
				if (player.nb == this.stick) {
					this.side = player.side;
					if (player.side === "left")
						this.center[0] = new Vec2((player.paddle[0].pos.x + (player.size[0] / 2)) + (this.radius * 4), player.paddle[0].pos.y + (player.size[1] / 2));
					else if (player.side === "right")
						this.center[0] = new Vec2((player.paddle[0].pos.x + (player.size[0] / 2)) - (this.radius * 4), player.paddle[0].pos.y + (player.size[1] / 2));
					else if (player.side === "up")
						this.center[0] = new Vec2(player.paddle[0].pos.x + (player.size[0] / 2), (player.paddle[0].pos.y + (player.size[1] / 2)) + (this.radius * 4));
					else
						this.center[0] = new Vec2(player.paddle[0].pos.x + (player.size[0] / 2), (player.paddle[0].pos.y + (player.size[1] / 2)) - (this.radius * 4));
				}
			}
			return;
		}

		let rad = this.dir * Math.PI / 180;
		let new_x, new_y;
		if (this.radius > this.speed) {
			new_x = this.center[0].x + (Math.cos(rad) * this.speed);
			new_y = this.center[0].y + (Math.sin(rad) * this.speed);
			this.center[0] = new Vec2(new_x, new_y);
			return;
		}

		let tmp_speed = this.radius;
		let collision = false;
		while (!collision && tmp_speed <= this.speed) {
			for (let center of this.center) {
				new_x = center.x + (Math.cos(rad) * tmp_speed);
				new_y = center.y + (Math.sin(rad) * tmp_speed);
				collision = try_collide(new_x, new_y, this.radius, players, walls, obstacle, this.ai_hitbox);
				if (collision)
					break;
			}
			tmp_speed += this.radius;
		}
		if (!collision) {
			new_x = this.center[0].x + (Math.cos(rad) * this.speed);
			new_y = this.center[0].y + (Math.sin(rad) * this.speed);
		}
		this.center[0] = new Vec2(new_x, new_y);
	}

	collide(walls, players, obstacle) {
		if (obstacle)
			if (getDist(this.center[0], obstacle.center) <= this.radius + obstacle.radius && obstacle.solid)
				obstacle.collide(this);
		if (walls)
			for (let wall of walls)
				if (!wall.square)
					wall.collide(this);
		if (!this.ai_hitbox)
			for (let player of players)
				player.collide(this);
	}

	update(core, delta) {
		this.speed = this.speed_per_sec * delta * this.multiplier;
		this.move(core.players, core.walls, core.obstacle);
		this.collide(core.walls, core.players, core.obstacle);
		if (!this.ai_hitbox)
			this.goal(core.players, core.square);
		this.unstuck(core.square);

		if (this.borderless) {
			if (this.center[0].y < 0)
				this.center[0].y += canvas.height;
			else if (this.center[0].y > canvas.height)
				this.center[0].y -= canvas.height;
			this.center[1].x = this.center[0].x;
			this.center[1].y = this.center[0].y + canvas.height;
			this.center[2].x = this.center[0].x;
			this.center[2].y = this.center[0].y - canvas.height;
		}
	}

	draw() {
		for (let center of this.center)
			ctx_circle(ctx, center.x, center.y, this.radius).fill();
	}

	unstuck(mod) {
		if (mod)
			return;
		if ((Math.round(this.dir) % 360 >= 85 && Math.round(this.dir) % 360 <= 95) || (Math.round(this.dir) % 360 >= -275 && Math.round(this.dir) % 360 <= -265)) {
			if (this.last_hit == 1)
				this.dir -= 5;
			else
				this.dir += 5;
		}
		if ((Math.round(this.dir) % 360 >= 265 && Math.round(this.dir) % 360 <= 275) || (Math.round(this.dir) % 360 >= -95 && Math.round(this.dir) % 360 <= -85)) {
			if (this.last_hit == 1)
				this.dir += 5;
			else
				this.dir -= 5;
		}

	}

	goal(players, mod) {
		let ball_box = new Vec2(this.center[0].x - this.radius, this.center[0].y - this.radius);
		for (let player of players) {
			if (is_colliding(ball_box, [this.radius * 2, this.radius * 2], player.goal.pos, player.goal.size)) {
				this.draw();
				if (players.length === 2) {
					if (player.nb === 1)
						players[1].score += 1;
					else
						players[0].score += 1;
				}
				else if (mod) {
					if (player.nb == this.last_hit)
						player.score -= 1;
					else if (this.last_hit)
						players[this.last_hit - 1].score += 1;
					else
						for (let other of players)
							if (other.nb != player.nb) {
								other.score += 1;
							}
				}
				else if (players.length === 4) {
					if (player.nb === 1 || player.nb === 2) {
						players[2].score += 1;
						players[3].score += 1;
					}
					else {
						players[0].score += 1;
						players[1].score += 1;
					}
				}
				this.stick = player.nb;
				this.multiplier = 1.0;
				this.side = player.side;
				if (player.side === "left")
					this.center[0] = new Vec2((player.paddle[0].pos.x + (player.size[0] / 2)) + (this.radius * 2), player.paddle[0].pos.y + (player.size[1] / 2));
				else if (player.side === "right")
					this.center[0] = new Vec2((player.paddle[0].pos.x + (player.size[0] / 2)) - (this.radius * 2), player.paddle[0].pos.y + (player.size[1] / 2));
				else if (player.side === "up")
					this.center[0] = new Vec2(player.paddle[0].pos.x + (player.size[0] / 2), (player.paddle[0].pos.y + (player.size[1] / 2)) + (this.radius * 2));
				else
					this.center[0] = new Vec2(player.paddle[0].pos.x + (player.size[0] / 2), (player.paddle[0].pos.y + (player.size[1] / 2)) - (this.radius * 2));
				break;
			}
		}
	}

	launch() {
		if (this.stick == 0) {
			this.dir = randInt(0, 360);
			while ((this.dir >= 75 && this.dir <= 105) || (this.dir >= 255 && this.dir <= 285))
				this.dir = randInt(0, 360);
		}
		else {
			if (this.side === "left")
				this.dir = 0;
			else if (this.side === "right")
				this.dir = 180;
			else if (this.side === "up")
				this.dir = 90;
			else
				this.dir = 270;
		}
		this.last_hit = this.stick;
		this.stick = 0;
		this.multiplier = 1.0;
	}

	responsive(old_sizes) {
		this.speed_per_sec = canvas.width / 3;
		this.radius = Math.floor(canvas.height * 0.01);
		const pos_ratio = [this.center[0].x / old_sizes[0], this.center[0].y / old_sizes[1]];
		this.center[0] = new Vec2(pos_ratio[0] * canvas.width, pos_ratio[1] * canvas.height);
		if (this.borderless) {
			if (this.center[0].y < 0)
				this.center[0].y += canvas.height;
			else if (this.center[0].y > canvas.height)
				this.center[0].y -= canvas.height;
			this.center[1].x = this.center[0].x;
			this.center[1].y = this.center[0].y + canvas.height;
			this.center[2].x = this.center[0].x;
			this.center[2].y = this.center[0].y - canvas.height;
		}
	}
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function try_collide(x, y, radius, players, walls, obstacle, ai_hitbox = false) {
	let ball_box = new Vec2(x - radius, y - radius);

	for (let player of players)
		for (let paddle of player.paddle)
			if (is_colliding(ball_box, [radius * 2, radius * 2], paddle.pos, player.size))
				return true;
	
	if (obstacle && getDist(new Vec2(x, y), obstacle.center) <= radius + obstacle.radius && obstacle.solid)
		return true;

	if (ai_hitbox)
		if (is_colliding(ball_box, [radius * 2, radius * 2], ai_hitbox.pos, ai_hitbox.size))
			return true;

	if (!walls)
		return false;
	for (let wall of walls)
		if (!wall.square && is_colliding(ball_box, [radius * 2, radius * 2], wall.Hitbox.pos, wall.size))
			return true;
	return false;
}