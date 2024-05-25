const canvas = document.querySelector("#pong_canvas");
canvas.width = window.innerWidth * 0.80;
canvas.height = Math.floor(canvas.width * 0.482);
canvas.style.display = "block";
canvas.style.backgroundColor = "black";
canvas.style.position = "absolute";
canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";

const ctx = canvas.getContext("2d");
ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.lineWidth = 2;

export function resize_canvas() {
	canvas.width = window.innerWidth * 0.80;
	canvas.height = Math.floor(canvas.width * 0.482);
	canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
	canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
	ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.lineWidth = 2;
}

export function roundRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();
	return ctx;
}

export function ctx_circle(ctx, x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.closePath();
	return ctx;
}

export { canvas, ctx }