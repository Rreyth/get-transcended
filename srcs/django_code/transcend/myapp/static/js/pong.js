import { canvas, ctx } from "./game/canvas.js";
import { Game } from "./game/core.js";
import { Vec2 } from "./game/Vec2.js";
import { Player } from "./game/Player.js";
import { Wall } from "./game/Wall.js";
import { Ball } from "./game/Ball.js";
import { Obstacle } from "./game/Obstacle.js";

var timer;
var connect_last;
var loginInterval;
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
	if (timer === -1) {
		clearInterval(loginInterval);
		connect_hub();
	}
}

var game = new Game();
var gameInterval;

window.addEventListener('keydown', (event) => {
    game.inputs[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    delete game.inputs[event.key];
});

canvas.addEventListener("click", game.mouse_input);

function game_loop() {
	game.keyboard_input()
	game.tick();
	game.render();
}

function try_connect(GameHub) {
	//get the user or the token or smth
	const msg = {"type" : "connect", "cmd" : "token", "token" : "tqt"};
	GameHub.send(JSON.stringify(msg));
}


var GameHub = false;
var GameRoom = false

export function connect_hub() {
	const socket = "wss://" + window.location.hostname + ":8765";
	GameHub = new WebSocket(socket);
	GameHub.onerror = hub_error;
	GameHub.onopen = hub_open;
	GameHub.onmessage = parse_msg;
}

function hub_error(error) {
	console.error("Connection failed: ", error)
	timer = 5;
	connect_last = Date.now() / 1000;
	loginInterval = setInterval(connect_loop, 10);
}

function hub_open() {
	try_connect(GameHub)
}

function parse_msg(event) {
	var msg = JSON.parse(event.data)
	if (msg.type == "connectionRpl") {
		if (msg.success == "true") {
			console.log("Connection success")
			if (msg['alias'] !== undefined)
				game.alias = msg.alias
			game.start()
			gameInterval = setInterval(game_loop, 10)
		}
		else
			console.log("Connection failed") // + invalid user token ?? is it even possible to fail connect from web ??
	}
	else if (msg.type == "join")
		game.wait_screen.nb += 1;
	else if (msg.type == "start")
		game.state = "start";
	else if (msg.type == "update") {
		if ("timer" in msg) {
			game.start_screen.timer = msg.timer;
			return;
		}
		game.state = "game";
		for (let i = 0; i < game.players.length; i++) {
			game.players[i].paddle[0].pos = new Vec2(msg.players[i][0], msg.players[i][1]);
			game.players[i].score = msg.score[i];
		}
		game.ball.center[0] = new Vec2(msg.ball[0], msg.ball[1]);
		game.ball.stick = msg.ball[2];
		game.ball.speed = msg.ball[3];
		game.ball.dir = msg.ball[4];
		if (game.obstacle)
			game.obstacle.solid = msg.obstacle;
	}
	else if (msg.type == "endGame") {
		if ("cmd" in msg && msg.cmd == "quitwait") {
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
				game.wait_screen.nb -= 1;
			}
			return;
		}
		for (let i = 0; i < game.players.length; i++) {
			game.players[i].win = msg.win[i];
			game.players[i].score = msg.score[i];
		}
		if (game.state != "menu")
			game.state = "end";
		if (game.GameRoom) {
			game.GameRoom.close();
			game.GameRoom = false;
		}
	}
	else if (msg.type == "start" && game.state == "waiting") {
		if (!game.GameRoom) {
			game.GameRoom = new WebSocket(game.GameSocket);
			game.GameRoom.onerror = function() {
				console.log("Connection to room failed")
			}
			game.GameRoom.onopen = function() {
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
		game.state = "launch"; //start direct ??
	}
}


// // GameHub.onclose = function() { //fusion avec on error ?
// // 	console.log("Connection closed")
// // }