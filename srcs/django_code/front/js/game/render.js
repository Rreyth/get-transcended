import { canvas, ctx } from "./canvas.js";

export function render_game(core) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let player of core.players)
		player.draw();
	if (core.walls)
		for (let w of core.walls)
			w.draw();
	if (core.obstacle)
		core.obstacle.draw();

	render_text(core, core.players.length);

	core.ball.draw();
}

function render_text(core, nb_players) {
	let text = [];
	let pos = [];
	let color = "white";
	if (nb_players == 2) {
		text.push(core.players[0].score + " - " + core.players[1].score);
		text.push(core.players[0].name, core.players[1].name);
		const names_pos = [text[1].length * 0.005, text[2].length * 0.005];
		pos.push([canvas.width / 2, canvas.height * 0.03],
				[canvas.width * names_pos[0], canvas.height * 0.03],
				[canvas.width * (1 - names_pos[1]), canvas.height * 0.03]);
	}
	else if (core.square) {
		color = (core.obstacle) ? "rgb(128, 128, 128)" : "rgb(224, 224, 224)";
		for (let player of core.players) {
			text.push(player.score);
			let name = (player.name.length <= 7) ? player.name : player.name.substring(0, 5) + "." + player.name.substring(player.name.length - 1);
			if (core.online)
				name = (player.name.length <= 7) ? player.name : player.name.substring(0, 6) + ".";
			text.push(name);
		}
		pos.push([canvas.width * 0.4175, canvas.height * 0.505],
				[canvas.width * 0.46, canvas.height * 0.505],
				[canvas.width * 0.5825, canvas.height * 0.505],
				[canvas.width * 0.54, canvas.height * 0.505],
				[canvas.width / 2, canvas.height * 0.335],
				[canvas.width / 2, canvas.height * 0.42],
				[canvas.width / 2, canvas.height * 0.68],
				[canvas.width / 2, canvas.height * 0.59]);
	}
	else {
		text.push(core.players[0].score+ " - " + core.players[2].score);
		for (let player of core.players) {
			let name = (player.name.length <= 12) ? player.name : player.name.substring(0, 10) + "." + player.name.substring(player.name.length - 1);
			if (core.online)
				name = (player.name.length <= 12) ? player.name : player.name.substring(0, 11) + ".";
			text.push(name);
		}
		let names_pos = [];
		for (let i = 1; i < 5; i++)
			names_pos.push((text[i].length > 3) ? text[i].length * 0.005 : text[i].length * 0.015);
		pos.push([canvas.width / 2, canvas.height * 0.03],
				[canvas.width * names_pos[0], canvas.height * 0.03],
				[canvas.width * (names_pos[1] * 3), canvas.height * 0.03],
				[canvas.width * (1 - names_pos[2]), canvas.height * 0.03],
				[canvas.width * (1 - (names_pos[3] * 3)), canvas.height * 0.03]);
	}
	ctx.fillStyle = color;
	ctx.font = Math.floor(canvas.height * 0.05) + "px pong-teko";
	for (let i = 0; i < text.length; i++) {
		ctx.fillText(text[i], pos[i][0], pos[i][1]);
	}
	ctx.fillStyle = "white";
	ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
}

export function render_menu(core) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	core.menu.draw();
}

export function render_pause(core) {
	render_game(core);
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	core.pause[1].draw();
}

export function render_end(core) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const len = core.players.length;
	let score = [];
	if (len == 2)
		score.push(core.players[0].score, core.players[1].score);
	else if (core.square)
		score.push(core.players[0].score, core.players[1].score, core.players[2].score, core.players[3].score);
	else
		score.push(core.players[0].score, core.players[2].score);
	core.end.draw(core, score);
}

export function render_start(core) {
	render_game(core);
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	core.start_screen.draw(core.id);
}

export function render_wait(core) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	core.wait_screen.draw();
}

export function render_custom(core) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	core.custom_menu.draw();
}

export function tournament(core) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (core.state === "tournament menu") {
		core.tournament_menu.draw();
		return;
	}
	if (core.state === "tournament names") {
		core.tournament_names.draw();
		return;
	}
	core.tournament.draw(core);
}