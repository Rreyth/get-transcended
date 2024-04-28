import { Hitbox, is_colliding } from "./Hitbox.js";
import { canvas, ctx } from "./canvas.js";
import { Vec2 } from "./Vec2.js";

export class Wall {
	constructor(pos, square) {
		this.size = [canvas.width, canvas.height * 0.0075];
		this.pos = pos;
		this.square = square;

		if (!square) {
			if (pos == "up") {
				this.visual = new Vec2(0, (canvas.height * 0.05) - (this.size[1] / 2));
				this.Hitbox = new Hitbox(this.visual.x, this.visual.y + 2, this.size[0], this.size[1]);
			}
			else if (pos == "down") {
				this.visual = new Vec2(0, canvas.height - (canvas.height * 0.05) - (this.size[1] / 2));
				this.Hitbox = new Hitbox(this.visual.x, this.visual.y - 3, this.size[0], this.size[1]);
			}
		}
		else {
			if (pos == "up")
				this.visual = new Vec2(0, 0);
			else if (pos == "down")
				this.visual = new Vec2(0, canvas.height - this.size[1]);
			else if (pos == "left") {
				this.size.reverse();
				this.visual = new Vec2(0, 0);
			}
			else if (pos == "right") {
				this.size.reverse();
				this.visual = new Vec2(canvas.width - this.size[0], 0);
			}
			this.Hitbox = new Hitbox(this.visual.x, this.visual.y, this.size[0], this.size[1]);
		}
	}

	draw() {
		ctx.fillRect(this.visual.x, this.visual.y, this.size[0], this.size[1]);
	}

	collide(ball) {
		let ball_box = new Vec2(ball.center[0].x - ball.radius, ball.center[0].y - ball.radius);
		if (!is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], this.Hitbox.pos, this.size))
			return;
		this.Hitbox.collideWall(ball, this.pos);
	}

	responsive() {
		this.size = [canvas.width, canvas.height * 0.0075];
		if (this.square) {
			if (this.pos == "up")
				this.visual = new Vec2(0, 0);
			else if (this.pos == "down")
				this.visual = new Vec2(0, canvas.height - this.size[1]);
			else if (this.pos == "left") {
				this.size.reverse();
				this.visual = new Vec2(0, 0);
			}
			else if (this.pos == "right") {
				this.size.reverse();
				this.visual = new Vec2(canvas.width - this.size[0], 0);
			}
			this.Hitbox = new Hitbox(this.visual.x, this.visual.y, this.size[0], this.size[1]);
		}
		else {
			if (this.pos == "up") {
				this.visual = new Vec2(0, (canvas.height * 0.05) - (this.size[1] / 2));
				this.Hitbox = new Hitbox(this.visual.x, this.visual.y + 2, this.size[0], this.size[1]);
			}
			else if (this.pos == "down") {
				this.visual = new Vec2(0, canvas.height - (canvas.height * 0.05) - (this.size[1] / 2));
				this.Hitbox = new Hitbox(this.visual.x, this.visual.y - 3, this.size[0], this.size[1]);
			}
		}
	}
}