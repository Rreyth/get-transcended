export class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(other) {
		return new Vec2(this.x + other.x, this.y + other.y);
	}

	sub(other) {
		return new Vec2(this.x - other.x, this.y - other.y);
	}

	equal(other) {
		return this.x === other.x && this.y === other.y;
	}

	notEqual(other) {
		return this.x !== other.x || this.y !== other.y;
	}

	scale(nb) {
		this.x *= nb;
		this.y *= nb;
	}

	div(nb) {
		if (nb === 0) {
			return;
		}
		this.x /= nb;
		this.y /= nb;
	}

	move(speed, dist) {
		this.x += (speed.x * dist);
		this.y += (speed.y * dist);
	}

	normalize() {
		const len = Math.sqrt((this.x * this.x) + (this.y * this.y));
		this.div(len);
	}
}

export function dotProduct(v1, v2) {
	return ((v1.x * v2.x) + (v1.y * v2.y));
}

export function crossProduct(v1, v2) {
	return ((v1.x * v2.y) - (v1.y * v2.x));
}

export function getDist(v1, v2) {
	const dx = Math.pow(v2.x - v1.x, 2);
	const dy = Math.pow(v2.y - v1.y, 2);
	return Math.sqrt(dx + dy);
}