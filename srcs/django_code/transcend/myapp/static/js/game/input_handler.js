import { Vec2 } from './Vec2.js';

export function input_id(core, button, inputs) {
	const set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for (let key in inputs) {
		if (set.includes(key) && button.name.length < 4)
			button.name += key.toUpperCase();
		else if (key == "Backspace")
			button.name = button.name.slice(0, -1);
		else if (key == "Enter")
			core.menu.setValues("JOIN", core);
		delete inputs[key];
	}
}

function online_input(core, inputs) {
	if (core.state === "game") {
		for (let key in inputs) {
			if (core.players[core.id - 1].side === "left" || core.players[core.id - 1].side === "right") {
				if (key == "ArrowUp" || key.toUpperCase() == "W") {
					core.pressed.push("UP");
					core.players[core.id - 1].moveUp(core.walls);
				}
				else if (key == "ArrowDown" || key.toUpperCase() == "S") {
					core.pressed.push("DOWN");
					core.players[core.id - 1].moveDown(core.walls);
				}
			}
			if (core.players[core.id - 1].side === "up" || core.players[core.id - 1].side === "down") {
				if (key == "ArrowLeft" || key.toUpperCase() == "A") {
					core.pressed.push("LEFT");
					core.players[core.id - 1].moveLeft(core.walls);
				}
				else if (key == "ArrowRight" || key.toUpperCase() == "D") {
					core.pressed.push("RIGHT");
					core.players[core.id - 1].moveRight(core.walls);
				}
			}
			if (key == " " && core.ball.stick == core.id) {
				core.pressed.push("LAUNCH");
				core.ball.launch();
			}
		}
	}
	if (core.mode === "solo") {
		core.pressed = [];
		ai_moves(core, core.players[1]);
	}
}

export function input_handler(core, inputs) {
	if (core.online || (core.mode === "solo" && !core.pause[0]))
		online_input(core, inputs);
	else {
		if (core.state === "game" && !core.pause[0]) {
			for (let player of core.players) {
				if (player.name === "AI")
					ai_moves(core, player);
				else
					player_moves(core, player, inputs);
			}
		}
	}
}

export function mouse_handler(core, pos) {
	if (core.state === "end")
		core.end.click(core, pos);
	else if (core.state === "menu")
		core.menu.click(core, pos);
	else if (core.pause[0])
		core.pause[1].click(core, pos);
	else if (core.state === "custom")
		core.custom_menu.click(core, pos);
	else if (core.state === "waiting")
		core.wait_screen.click(core, pos);
}

function ai_moves(core, player) {
	for (let ai of core.ai) {
		if (ai.id === player.nb) {
			for (let move of ai.moves) {
				if (move === "UP")
					player.moveUp(core.walls);
				else if (move === "DOWN")
					player.moveDown(core.walls);
				else if (move === "LEFT")
					player.moveLeft(core.walls);
				else if (move === "RIGHT")
					player.moveRight(core.walls);
				else if (move === "LAUNCH" && core.ball.stick === player.nb)
					core.ball.launch();
			}
			ai.pos = new Vec2(player.paddle[0].pos.x, player.paddle[0].pos.y);
			ai.moves = [];
			break;
		}
	}
}

function player_moves(core, player, inputs) {
	for (let key in inputs) {
		if (player.side === "left") {
			if (player.nb == 1) {
				if (key.toUpperCase() == "W")
					player.moveUp(core.walls);
				if (key.toUpperCase() == "S")
					player.moveDown(core.walls);
			}
			else {
				if (key.toUpperCase() == "T")
					player.moveUp(core.walls);
				if (key.toUpperCase() == "G")
					player.moveDown(core.walls);
			}
			if (key == " " && core.ball.stick == player.nb)
				core.ball.launch();
		}
		else if (player.side === "right") {
			if (player.nb == 2 || player.nb == 4) {
				if (key == "ArrowUp")
					player.moveUp(core.walls);
				if (key == "ArrowDown")
					player.moveDown(core.walls);
			}
			else {
				if (key == "8")
					player.moveUp(core.walls);
				if (key == "5")
					player.moveDown(core.walls);
			}
			if (key == "0" && core.ball.stick == player.nb)
				core.ball.launch();
		}
		else if (player.side === "up") {
			if (key.toUpperCase() == "T")
					player.moveLeft(core.walls);
			if (key.toUpperCase() == "Y")
					player.moveRight(core.walls);
			if (key.toUpperCase() == "H" && core.ball.stick == player.nb)
				core.ball.launch();
		}
		else if (player.side === "down") {
			if (key.toUpperCase() == "K")
				player.moveLeft(core.walls);
			if (key.toUpperCase() == "L")
				player.moveRight(core.walls);
			if (key.toUpperCase() == "O" && core.ball.stick == player.nb)
				core.ball.launch();
		}
	}
}

export function escape_handler(core) {
	if (core.state === "end" || core.state === "custom") {
		core.state = "menu";
		core.mode = "none";
		core.max_score = 10;
	}
	if (core.state === "game") {
		core.pause[0] = !core.pause[0];
		if (!core.online && core.pause[0])
			core.pause[1].freeze = true;
		else
			core.pause[1].freeze = false;
	}
	delete core.inputs["Escape"];
}