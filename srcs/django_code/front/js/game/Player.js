import { Vec2 } from "./Vec2.js";
import { Hitbox, is_colliding } from "./Hitbox.js";
import { canvas, ctx } from "./canvas.js";

export class Player {
	constructor(nb, name, nb_total, borderless, square) {
		this.speed_per_sec = canvas.height;
		this.speed = this.speed_per_sec * 0.01;
		this.nb = nb;
		this.name = name;
		this.square = square;
		this.borderless = borderless;
		this.win = "LOSE";
		this.score = 0;
		this.initPaddle(nb_total, borderless, square);
	}

	initPaddle(nb_total, borderless, square) {
		this.size = [canvas.width * 0.007, canvas.height * 0.1];
		let pos;
		if (nb_total == 2) {
			if (this.nb == 1) {
				pos = [canvas.width * 0.02, (canvas.height / 2) - (this.size[1] / 2)];
				this.goal = new Hitbox(-50, 0, 50, canvas.height);
				this.side = "left";
			}
			else {
				pos = [canvas.width * 0.98 - this.size[0], (canvas.height / 2) - (this.size[1] / 2)];
				this.goal = new Hitbox(canvas.width, 0, 50, canvas.height);
				this.side = "right";
			}
		}
		else if (square) {
			const goal_size = canvas.height * 0.0125;
			if (this.nb == 1) {
				pos = [canvas.width * 0.02, (canvas.height / 2) - (this.size[1] / 2)];
				this.goal = new Hitbox(-50 + goal_size, 0, 50, canvas.height);
				this.side = "left";
			}
			else if (this.nb == 2) {
				pos = [canvas.width * 0.98 - this.size[0], (canvas.height / 2) - (this.size[1] / 2)];
				this.goal = new Hitbox(canvas.width - goal_size, 0, 50, canvas.height);
				this.side = "right";
			}
			else if (this.nb == 3) {
				this.size.reverse();
				this.size[0] = canvas.width * 0.1;
				this.speed_per_sec = canvas.width;
				pos = [(canvas.width / 2) - (this.size[0] / 2), canvas.height * 0.02];
				this.goal = new Hitbox(0, -50 + goal_size, canvas.width, 50);
				this.side = "up";
			}
			else {
				this.size.reverse();
				this.size[0] = canvas.width * 0.1;
				this.speed_per_sec = canvas.width;
				pos = [(canvas.width / 2) - (this.size[0] / 2), canvas.height * 0.98 - this.size[1]];
				this.goal = new Hitbox(0, canvas.height - goal_size, canvas.width, 50);
				this.side = "down";
			}
		}
		else {
			if (this.nb == 1) {
				pos = [canvas.width * 0.02, (canvas.height / 2) - this.size[1]];
				this.goal = new Hitbox(-50, 0, 50, canvas.height);
				this.side = "left";
			}
			else if (this.nb == 2){
				pos = [canvas.width * 0.02 + 50, (canvas.height / 2)];
				this.goal = new Hitbox(-50, 0, 50, canvas.height);
				this.side = "left";
			}
			else if (this.nb == 3) {
				pos = [canvas.width * 0.98 - this.size[0], (canvas.height / 2) - this.size[1]];
				this.goal = new Hitbox(canvas.width, 0, 50, canvas.height);
				this.side = "right";
			}
			else {
				pos = [canvas.width * 0.98 - this.size[0] - 50, (canvas.height / 2)];
				this.goal = new Hitbox(canvas.width, 0, 50, canvas.height);
				this.side = "right";
			}
		}
		this.paddle = [new Hitbox(pos[0], pos[1], this.size[0], this.size[1])];
		if (borderless) {
			this.paddle.push(new Hitbox(pos[0], pos[1] - canvas.height, this.size[0], this.size[1]));
			this.paddle.push(new Hitbox(pos[0], pos[1] + canvas.height, this.size[0], this.size[1]));
		}
	}

	moveUp(walls) {
		const init_speed = this.speed / 4;
		let tmp_speed = init_speed;
		let collision = false;
		let tmp_pos;
		while (walls && !collision && tmp_speed <= this.speed) {
			tmp_pos = new Vec2(this.paddle[0].pos.x, this.paddle[0].pos.y - tmp_speed);
			collision = is_colliding(tmp_pos, this.size, walls[0].Hitbox.pos, walls[0].size);
			if (collision)
				break;
			tmp_speed += init_speed;
		}
		if (!collision){
			this.paddle[0].pos.y -= this.speed;
		}
		else {
			this.paddle[0].pos.y = Math.round(this.paddle[0].pos.y - (tmp_speed - init_speed));
			while (!is_colliding(this.paddle[0].pos, this.size, walls[0].Hitbox.pos, walls[0].size))
				this.paddle[0].pos.y -= 1;
		}

		if (this.borderless) 
			if (this.paddle[0].pos.y + (this.size[1] / 2) < 0)
				this.paddle[0].pos.y += canvas.height;
	}

	moveDown(walls) {
		const init_speed = this.speed / 4;
		let tmp_speed = init_speed;
		let collision = false;
		let tmp_pos;
		while (walls && !collision && tmp_speed <= this.speed) {
			tmp_pos = new Vec2(this.paddle[0].pos.x, this.paddle[0].pos.y + tmp_speed);
			collision = is_colliding(tmp_pos, this.size, walls[1].Hitbox.pos, walls[1].size);
			if (collision)
				break;
			tmp_speed += init_speed;
		}
		if (!collision)
			this.paddle[0].pos.y += this.speed;
		else {
			this.paddle[0].pos.y = Math.round(this.paddle[0].pos.y + (tmp_speed - init_speed));
			while (!is_colliding(this.paddle[0].pos, this.size, walls[1].Hitbox.pos, walls[1].size))
				this.paddle[0].pos.y += 1;
		}

		if (this.borderless)
			if (this.paddle[0].pos.y + (this.size[1] / 2) > canvas.height)
				this.paddle[0].pos.y -= canvas.height;
	}

	moveLeft(walls) {
		const init_speed = this.speed / 4;
		let tmp_speed = init_speed;
		let collision = false;
		let tmp_pos;
		while (walls && !collision && tmp_speed <= this.speed) {
			tmp_pos = new Vec2(this.paddle[0].pos.x - tmp_speed, this.paddle[0].pos.y);
			collision = is_colliding(tmp_pos, this.size, walls[2].Hitbox.pos, walls[2].size);
			if (collision)
				break;
			tmp_speed += init_speed;
		}
		if (!collision)
			this.paddle[0].pos.x -= this.speed;
		else {
			this.paddle[0].pos.x = Math.round(this.paddle[0].pos.x - (tmp_speed - init_speed));
			while (!is_colliding(this.paddle[0].pos, this.size, walls[2].Hitbox.pos, walls[2].size))
				this.paddle[0].pos.x -= 1;
		}
	}

	moveRight(walls) {
		const init_speed = this.speed / 4;
		let tmp_speed = init_speed;
		let collision = false;
		let tmp_pos;
		while (walls && !collision && tmp_speed <= this.speed) {
			tmp_pos = new Vec2(this.paddle[0].pos.x + tmp_speed, this.paddle[0].pos.y);
			collision = is_colliding(tmp_pos, this.size, walls[3].Hitbox.pos, walls[3].size);
			if (collision)
				break;
			tmp_speed += init_speed;
		}
		if (!collision)
			this.paddle[0].pos.x += this.speed;
		else {
			this.paddle[0].pos.x = Math.round(this.paddle[0].pos.x + (tmp_speed - init_speed));
			while (!is_colliding(this.paddle[0].pos, this.size, walls[3].Hitbox.pos, walls[3].size))
				this.paddle[0].pos.x += 1;
		}
	}

	draw() {
		for (let paddle of this.paddle)
			ctx.fillRect(paddle.pos.x, paddle.pos.y, this.size[0], this.size[1]);
	}

	collide(ball) {
		const ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
		for (let paddle of this.paddle) {
			if (!is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, this.size))
				continue;
			paddle.collidePaddle(ball, this.nb);
			break;
		}
	}

	update(delta) {
		if (this.borderless) {
			this.paddle[1].pos.y = this.paddle[0].pos.y - canvas.height;
			this.paddle[2].pos.y = this.paddle[0].pos.y + canvas.height;
		}
		this.speed = this.speed_per_sec * delta;
	}

	responsive(old_sizes) {
		this.speed_per_sec = canvas.height;
		this.size = [canvas.width * 0.007, canvas.height * 0.1];
		if (this.side == "up" || this.side == "down") {
			this.size.reverse();
			this.size[0] = canvas.width * 0.1;
		}
		if (this.square) {
			const goal_size = canvas.height * 0.0125;
			if (this.side == "left")
				this.goal = new Hitbox(-50 + goal_size, 0, 50, canvas.height);
			else if (this.side == "right")
				this.goal = new Hitbox(canvas.width - goal_size, 0, 50, canvas.height);
			else if (this.side == "up")
				this.goal = new Hitbox(0, -50 + goal_size, canvas.width, 50);
			else
				this.goal = new Hitbox(0, canvas.height - goal_size, canvas.width, 50);
		}
		else {
			if (this.side == "left")
				this.goal = new Hitbox(-50, 0, 50, canvas.height);
			else
				this.goal = new Hitbox(canvas.width, 0, 50, canvas.height);
		}

		const pos_ratio = [this.paddle[0].pos.x / old_sizes[0], this.paddle[0].pos.y / old_sizes[1]];
		this.paddle[0] = new Hitbox(pos_ratio[0] * canvas.width, pos_ratio[1] * canvas.height, this.size[0], this.size[1]);
		if (this.borderless) {
			this.paddle[1] = new Hitbox(this.paddle[0].pos.x, this.paddle[0].pos.y - canvas.height, this.size[0], this.size[1]);
			this.paddle[2] = new Hitbox(this.paddle[0].pos.x, this.paddle[0].pos.y + canvas.height, this.size[0], this.size[1]);
		}
	}
}