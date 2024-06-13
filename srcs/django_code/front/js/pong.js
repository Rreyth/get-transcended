import { canvas, ctx, resize_canvas, reset_canvas } from "./game/canvas.js";
import { Game } from "./game/core.js";
import { Vec2 } from "./game/Vec2.js";
import { Player } from "./game/Player.js";
import { Wall } from "./game/Wall.js";
import { Ball } from "./game/Ball.js";
import { Obstacle } from "./game/Obstacle.js";
import { StartScreen } from "./game/StartScreen.js";
import { WaitScreen } from "./game/WaitScreen.js";
import { update_sizes } from "./game/update.js";
import { Tournament } from "./game/Tournament.js";
import { Thread } from "./thread.js";
import { user, user_token } from "./helpers.js"

const link_code = window.location.search.match(/=(.*)/);

let timer;
let connect_last;
let loginInterval;
function connect_loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(255, 102, 102)";
	ctx.fillText("Cannot reach server", canvas.width / 2, canvas.height * 0.45);
	ctx.fillText("Retrying in " + timer + " seconds", canvas.width / 2, canvas.height * 0.55);
	ctx.fillStyle = "white";
	const tmp = Date.now() / 1000;
	if (tmp - connect_last >= 1) {
		connect_last = tmp;
		timer -= 1;
	}
	if (timer <= 0) {
		clearInterval(loginInterval);
		connect_hub();
	}
}

let game = new Game();
let gameInterval;

const keydown_event = (event) => {
    game.inputs[event.key] = true;
};

window.addEventListener('keydown', keydown_event);

const keyup_event = (event) => {
    delete game.inputs[event.key];
};

window.addEventListener('keyup', keyup_event);

const wheel_event = (event) => {
	if (game.state === "tournament") {
		if (event.deltaY > 0)
			game.tournament.scroll("down");
		else 
			game.tournament.scroll("up");
	}
	if (game.state === "tournament names") {
		if (event.deltaY > 0)
			game.tournament_names.scroll("down");
		else 
			game.tournament_names.scroll("up");
	}
};

canvas.addEventListener('wheel', wheel_event);

canvas.addEventListener("click", game.mouse_input);

function game_loop() {
	game.keyboard_input()
	game.tick();
	game.render();
}

let user_infos;
try {
	user_infos = await user();
	game.alias = user_infos.username;
} catch (error) {
}

let token = await user_token();

function try_connect(GameHub) {
	const msg = {"type" : "connect", "cmd" : "token", "token" : token};
	GameHub.send(JSON.stringify(msg));
}

let GameHub = false;

export function connect_hub() {
	const socket = "wss://" + window.location.hostname + ":8765";
	GameHub = new WebSocket(socket);
	GameHub.onerror = hub_error;
	GameHub.onclose = hub_error;
	GameHub.onopen = hub_open;
	GameHub.onmessage = parse_msg;
}

function hub_error(error) {
	clearInterval(gameInterval);
	console.error("Connection failed: ", error);
	timer = 5;
	connect_last = Date.now() / 1000;
	loginInterval = Thread.new(connect_loop, 1000);
}

function hub_open() {
	try_connect(GameHub)
}

function invalid_token() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "rgb(255, 102, 102)";
	ctx.fillText("Invalid user", canvas.width / 2, canvas.height / 2);
	ctx.fillStyle = "white";
}

function parse_msg(event) {
	let msg = JSON.parse(event.data);
	let room_id = 0;
	let wait_nb = 0;
	if (msg.type == "connectionRpl") {
		if (msg.success == "true") {
			console.log("Connection success");
			game.start(GameHub);
			if (link_code) {
				game.menu.buttons[5].name = link_code[1];
				game.menu.setValues("JOIN", game);
			}
			gameInterval = Thread.new(game_loop, 10);
		}
		else {
			console.log("Connection failed");
			Thread.new(invalid_token, 500);
		}
	}
	else if (msg.type == "join") {
		if (game.state == "tournament") {
			game.players.push(new Player(game.players.length + 1, msg.alias, 2, false, false));
			game.tournament.initPlayers(game.players);
		}
		else
			game.wait_screen.nb += 1;
	}
	else if (msg.type == "start" && game.state != "waiting" && game.state != "tournament")
		game.state = (game.tournament) ? "tournament" : "start";
	else if (msg.type == "update") {
		if ('tournament' in msg) {
			game.tournament.onlineUpdate(msg, game);
			return;
		}
		if ("timer" in msg) {
			if (game.state === "tournament")
				game.tournament.timer[0] = msg.timer;
			else
				game.start_screen.timer = msg.timer;
			return;
		}
		if (game.state != "tournament")
			game.state = "game";
		for (let i = 0; i < game.players.length; i++) {
			game.players[i].paddle[0].pos = new Vec2(msg.players[i][0] * canvas.width, msg.players[i][1] * canvas.height);
			game.players[i].score = msg.score[i];
			game.players[i].spec = false
		}
		game.ball.center[0] = new Vec2(msg.ball[0] * canvas.width, msg.ball[1] * canvas.height);
		game.ball.stick = msg.ball[2];
		game.ball.speed = msg.ball[3];
		game.ball.dir = msg.ball[4];
		game.ball.spec = false
		if (game.obstacle)
			game.obstacle.solid = msg.obstacle;
		if (game.state === "tournament") {
			game.tournament.timer[0] = 0;
			game.tournament.resizeSpec(game);
		}
	}
	else if (msg.type == "endGame") {
		if ("cmd" in msg && msg.cmd == "quitWait") {
			if (msg.id == game.id) {
				game.state = "menu";
				if (game.GameRoom) {
					game.GameRoom.close();
					game.GameRoom = false;
				}
			}
			else {
				if (game.id > msg.id)
					game.id -= 1;
				if (game.state == "tournament") {
					game.players = game.players.filter(player => player.nb != msg.id);
					for (let player of game.players) {
						if (player.nb > msg.id)
							player.nb--;
					}
					game.tournament.initPlayers(game.players);
				}
				else
					game.wait_screen.nb -= 1;
			}
			return;
		}
		for (let player of msg.match) {
			game.players[player.id - 1].win = (player.win) ? "WIN" : "LOSE";
			game.players[player.id - 1].score = player.score;
		}
		if (game.state != "menu")
			game.state = "end";
		if (game.GameRoom) {
			game.GameRoom.close();
			game.GameRoom = false;
		}
	}
	else if (msg.type == "start" && (game.state == "waiting" || game.state == "tournament")) {
		if (!game.GameRoom) {
			const socket = "wss://" + window.location.hostname + ":" + game.GamePort;
			game.GameRoom = new WebSocket(socket);
			game.GameRoom.onerror = function() {
				console.error("Connection to room failed");
			}
			game.GameRoom.onopen = function() {
				if (game.tournament)
					game.GameRoom.send(JSON.stringify({"type" : "join", "name" : game.alias, "tournament" : game.tournament_id}));
				else
					game.GameRoom.send(JSON.stringify({"type" : "join", "name" : game.alias}));
			}
			game.GameRoom.onmessage = parse_msg;
			return;
		}
		game.id = msg.id;
		game.players = [];
		game.walls = [];
		for (let player of msg.players)
			game.players.push(new Player(player[0], player[1], player[2], player[3], player[4]));
		for (let wall of msg.walls)
			game.walls.push(new Wall(wall[0], wall[1]));
		if (game.walls.length == 0)
			game.walls = false;
		game.ball = new Ball(msg.ball);
		if ("obstacle" in msg)
			game.obstacle = new Obstacle();
		if (game.state == "tournament") {
			game.tournament.initPlayers(game.players);
			game.tournament_id = game.id;
		}
		game.state = "launch";
	}
	else if (msg.type == "joinResponse") {
		if (msg.success == 'false')
			game.menu.err = (msg.error) ? msg.error : "Room " + game.menu.buttons[5].name + " doesn't exist";
		else {
			game.GamePort = msg.port;
			room_id = game.menu.buttons[5].name;
			game.id = msg.pos;
			game.online = true;
			game.mode = "ONLINE";
			if (msg.mode == "tournament") {
				game.tournament = new Tournament(msg.custom_mods, msg.max, msg.ai, msg.score, true, false);
				game.players = [];
				for (let i = 0; i < msg.players.length; i++) {
					game.players.push(new Player(i + 1, msg.players[i], 2, msg.custom_mods.includes("BORDERLESS"), false));
				}
				game.tournament.initPlayers(game.players);
				game.tournament.id = room_id;
				game.tournament_id = game.id;
				game.state = "tournament";
			}
			else {
				game.state = "waiting";
				wait_nb = msg.max;
				game.square = msg.custom_mods.includes("1V1V1V1");
				game.start_screen = new StartScreen(msg.mode, game.online, msg.custom_mods.includes("1V1V1V1"), wait_nb);
			}
			game.customs = msg.custom_mods;
		}
	}
	else if (msg.type == "GameRoom") {
		game.GamePort = msg.port;
		room_id = msg["ID"];
		game.mode = "ONLINE";
		game.id = msg.pos;
		game.online = true;
		wait_nb = 2;
		if (game.state == "custom") {
			game.wait_screen = new WaitScreen(room_id, game.id, Object.keys(game.custom_menu.players).length, "CUSTOM");
		}
		game.state = "waiting";
	}
	else if (msg.type == "TournamentRoom") {
		game.GamePort = msg.port;
		room_id = msg["ID"];
		game.mode = "ONLINE";
		game.state = "tournament";
		game.id = msg.pos;
		game.tournament_id = game.id;
		game.online = true;
		game.tournament.id = room_id;
	}
	if ((msg.type == "GameRoom" || msg.type == "joinResponse" || msg.type == "TournamentRoom") && game.mode != "none") {
		game.menu.buttons[5].name = "";
		game.menu.err = false;
		if (!game.start_screen)
			game.start_screen = new StartScreen(game.mode, game.online);
		if (game.online && !game.wait_screen && game.state != "tournament")
			game.wait_screen = new WaitScreen(room_id, game.id, wait_nb, "QuickGame Online");
	}
}


window.addEventListener("resize", resize_all);

function resize_all() {
	const old_sizes = [canvas.width, canvas.height];
	resize_canvas();
	update_sizes(game, old_sizes);
}

export async function reset() {
	window.addEventListener('keydown', keydown_event);
	window.addEventListener('keyup', keyup_event);
	window.addEventListener("resize", resize_all);
	reset_canvas();
	canvas.addEventListener('wheel', wheel_event);
	canvas.addEventListener("click", game.mouse_input);
	try {
		user_infos = await user();
		game.alias = user_infos.username;
	} catch (error) {
	}
	token = await user_token();
}

window.addEventListener("ThreadClearEvent", function(event) {
	window.removeEventListener("resize", resize_all);
	window.removeEventListener('keydown', keydown_event);
	window.removeEventListener('keyup', keyup_event);
	canvas.removeEventListener('wheel', wheel_event);
	canvas.removeEventListener("click", game.mouse_input);
});