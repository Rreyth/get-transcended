import { Button } from "./Button.js";
import { Arrow } from "./Arrow.js";
import { Vec2 } from "./Vec2.js";
import { canvas, ctx } from "./canvas.js";
import { is_colliding } from "./Hitbox.js";
import { StartScreen } from "./StartScreen.js";
import { Player } from "./Player.js";
import { Obstacle } from "./Obstacle.js";
import { Ball } from "./Ball.js";

export class Tournament {
	constructor(mods, nb_players, nb_ai, max_score, online, creator) { //state = (waiting, ongoing, interlude, end) //receive room id //add spec state ?
		this.id = 1234;
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4];
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true)];
		this.size[1] = (nb_players <= 20) ? canvas.height * 0.04 * nb_players : canvas.height * 0.04 * 20;
		this.visual.push(new Button("", canvas.width * 0.85, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		this.start_names = this.visual[1].y + (canvas.height * 0.025);
		const spec_size = [canvas.width  * 0.65, canvas.height * 0.65];
		this.spec_screen = new Button("", (canvas.width / 2) - (spec_size[0] / 2), (canvas.height / 2) - (spec_size[1] / 2), spec_size[0], spec_size[1], true);
		this.init_pos = this.start_names;
		this.nb_ai = nb_ai;
		this.max_players = nb_players;
		this.max_score = max_score;
		this.mods = mods;
		this.online = online;
		this.state = "waiting";
		this.timer = [5, Date.now() / 1000];
		if (nb_players > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.977, canvas.height / 2 - (this.size[1] * 0.49), canvas.width * 0.02, canvas.height * 0.02, "up"),
			new Arrow("", canvas.width * 0.977, canvas.height / 2 + (this.size[1] * 0.465), canvas.width * 0.02, canvas.height * 0.02, "down")];
		}
		this.nb_match = nb_players - 1;
		this.players = new Map();
		this.players.set(creator, "(SPEC)");
	}

	initPlayers(players) {
		this.players = new Map();
		for (const player of players) {
			this.players.set(player, "(SPEC)");
		}
		if (this.players.size === this.max_players) {
			this.initMatches();
		}
	}

	initMatches() {
		let index = 1;
		this.matches = {};
		this.matches[index] = [];
		for (const [player, state] of this.players) {
			if (this.matches[index].length == 2) {
				index++;
				this.matches[index] = [];
			}
			if (state != "(LOSE)" && state != "(LEFT)") {
				this.matches[index].push(player);
			}
		}
		this.match_index = 1;
		this.state = "interlude";
		this.timer = [5, Date.now() / 1000];
		if (index === 1 && this.matches[index].length === 1) {
			this.endTournament();
		}
	}

	checkMatch() {
		if (!(this.match_index in this.matches))
			return;
		const match = this.matches[this.match_index];
		for (const p of match) {
			for (const [player, state] of this.players) {
				if (p.nb === player.nb && state === "(LEFT)") {
					this.match_index++;
					this.timer = [5, Date.now() / 1000];
					break;
				}
			}
			if (match != this.matches[this.match_index])
				break;
		}
	}

	endTournament() { //(send end to hub)
		for (const [p, state] of this.players) {
			if (state != "(LOSE)" && state != "(LEFT)") {
				this.players.set(p, "(WIN)");
				break;
			}
		}
		this.state = "end";
	}

	endMatch(players) {
		this.nb_match--;
		for (let player of players) {
			for (const [p] of this.players) {
				if (p.nb === player.tournament) {
					if (player.win === "LOSE")
						this.players.set(p, "(LOSE)");
					else
						this.players.set(p, "(SPEC)");
					break;
				}
			}
		}
		this.match_index++;
		//check impair for next match
		this.state = "interlude";
	}

	startMatch(core) { 
		this.timer[0] = 5;
		this.state = "ongoing";
		core.players = [];
		let i = 1;
		for (const player of this.matches[this.match_index]) {
			for (const [p] of this.players) {
				if (player.nb === p.nb) {
					this.players.set(p, "(PLAY)");
					break;
				}
			}
			core.players.push(new Player(i, player.name, 2, this.mods.includes("BORDERLESS"), false));
			core.players[i - 1].tournament = player.nb;
			i++;
		}
		core.start_screen = new StartScreen((this.online) ? "ONLINE" : "LOCAL", core.online);
		if (this.mods.includes("OBSTACLE"))
			core.obstacle = new Obstacle();
		core.ball = new Ball(this.mods.includes("BORDERLESS"));
		core.state = "start";
	}

	update(core) {
		if (this.state === "interlude") {
			this.checkMatch();
			if (!(this.match_index in this.matches))
				this.initMatches();
			const tmp = Date.now() / 1000;
			if (tmp - this.timer[1] >= 1) {
				this.timer[0]--;
				this.timer[1] = tmp;
			}
			if (this.timer[0] <= 0) {
				this.startMatch(core);
			}
		}
	}

	draw() {
		if (this.online)
			ctx.fillText("ID : " + this.id, canvas.width * 0.06, canvas.height * 0.1);
		ctx.font = Math.floor(canvas.height * 0.15) + "px pong-teko";
		ctx.fillText("TOURNAMENT", canvas.width / 2, canvas.height * 0.1);
		ctx.font = Math.floor(canvas.height * 0.06) + "px pong-teko";
		if (this.state === "ongoing") {
			const match = this.matches[this.match_index];
			ctx.fillText("SPECTATING", canvas.width / 2, canvas.height * 0.87);
			ctx.textAlign = "left";
			ctx.fillText(match[0].name, this.spec_screen.x, canvas.height * 0.94);
			ctx.textAlign = "right";
			ctx.fillText(match[1].name, this.spec_screen.x + this.spec_screen.width, canvas.height * 0.94);
			ctx.textAlign = "center";
			ctx.fillText("VS", canvas.width / 2, canvas.height * 0.94);
		}
		this.button.draw();
		this.leftBox();
		this.rightBox();
		this.centerBox();
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		for (let b of this.visual) {
			b.draw();
		}
		if (this.arrows) {
			for (let arrow of this.arrows)
				arrow.draw()
		}
	}

	centerBox() {
		ctx.font = Math.floor(canvas.height * 0.085) + "px pong-teko";
		this.spec_screen.draw();
		if (this.state === "waiting") {
			ctx.fillText("WAITING FOR PLAYERS", canvas.width / 2, canvas.height * 0.45);
			ctx.fillText(this.players.size + "/" + this.max_players, canvas.width / 2, canvas.height * 0.55);
		}
		else if (this.state === "interlude") {
			ctx.fillText("NEXT MATCH", canvas.width / 2, canvas.height * 0.4);
			const names = this.matches[this.match_index][0].name + "   -   " + this.matches[this.match_index][1].name;
			ctx.fillText(names, canvas.width / 2, canvas.height * 0.5);
			ctx.fillText(this.timer[0].toString(), canvas.width / 2, canvas.height * 0.6);
		}
		else if (this.state === "ongoing") { //add spec state ??
			ctx.fillText("ONGOING MATCH", canvas.width / 2, canvas.height / 2);
			//render_game with a ratio and a pos (if spec) (only online)
			//render_game (if playing)
		}
		else if (this.state === "end") {
			ctx.fillText("WINNER", canvas.width / 2, canvas.height * 0.3);
			ctx.fillText("(insert img ?)", canvas.width / 2, canvas.height * 0.5); //TODO
			for (const [player, state] of this.players) {
				if (state === "(WIN)") {
					ctx.fillText(player.name, canvas.width / 2, canvas.height * 0.7);
					break;
				}
			}
		}
	}

	rightBox() {
		ctx.font = Math.floor(canvas.height * 0.04) + "px pong-teko";
		ctx.textAlign = "left";
		const gap = canvas.height * 0.04;
		let pos = this.start_names;
		for (const [player, state] of this.players) {
			const name = (player.name.length <= 9) ? player.name : player.name.slice(0, 9) + '.';
			ctx.fillText(name, canvas.width * 0.86, pos);
			ctx.fillText(state, canvas.width * 0.93, pos); //player state = (left, play, spec, lose, win) //win ?? end only
			pos += gap;
		}
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(this.visual[1].x, 0, this.visual[1].width, this.visual[1].y);
		ctx.fillRect(this.visual[1].x, this.visual[1].y + this.size[1], this.visual[1].width, this.visual[1].y);
		ctx.fillStyle = "white";
	}

	leftBox() {
		ctx.font = Math.floor(canvas.height * 0.05) + "px pong-teko";
		ctx.textAlign = "left";
		ctx.fillText((this.online) ? "ONLINE" : "LOCAL", canvas.width * 0.005, canvas.height * 0.35);
		ctx.fillText("PLAYERS:", canvas.width * 0.005, canvas.height * 0.40);
		ctx.fillText("AI:", canvas.width * 0.005, canvas.height * 0.45);
		ctx.fillText("BORDERLESS:", canvas.width * 0.005, canvas.height * 0.50);
		ctx.fillText("OBSTACLE:", canvas.width * 0.005, canvas.height * 0.55);
		ctx.fillText("MATCH SCORE:", canvas.width * 0.005, canvas.height * 0.60);
		ctx.fillText("MATCH LEFT:", canvas.width * 0.005, canvas.height * 0.65);
		ctx.textAlign = "center";
		ctx.fillText(this.max_players.toString(), canvas.width * 0.12, canvas.height * 0.40);
		ctx.fillText(this.nb_ai.toString(), canvas.width * 0.12, canvas.height * 0.45);
		ctx.fillText(this.mods.includes("BORDERLESS").toString(), canvas.width * 0.12, canvas.height * 0.50);
		ctx.fillText(this.mods.includes("OBSTACLE").toString(), canvas.width * 0.12, canvas.height * 0.55);
		ctx.fillText(this.max_score.toString(), canvas.width * 0.12, canvas.height * 0.60);
		ctx.fillText(this.nb_match.toString(), canvas.width * 0.12, canvas.height * 0.65);
	}

	scroll(dir) {
		if (this.players.size <= 20)
			return;
		const last_pos = this.start_names + ((canvas.height * 0.04) * (this.players.size - 1)); 
		if (dir === "up" && this.start_names < this.init_pos) {
			this.start_names += canvas.height * 0.02;
		}
		else if (dir === "down" && last_pos > (this.visual[1].y + this.size[1])) {
			this.start_names -= canvas.height * 0.02;
		}
	}

	click(core, mousePos) {
		const pos = new Vec2(mousePos[0], mousePos[1]);
		if (this.arrows) {
			for (let arrow of this.arrows) {
				if (is_colliding(pos, [0, 0], arrow.hitbox.pos, [arrow.width, arrow.height])) {
					this.scroll(arrow.dir);
					return;
				}
			}
		}

		if (is_colliding(pos, [0, 0], this.button.hitbox.pos, [this.button.width, this.button.height])) {
			core.state = "menu";
			core.mode = "none";
			core.max_score = 10;
			core.online = false;
			core.tournament_menu = false;
			core.tournament = false;
			//add leave state + msg for others
		}
	}

	responsive(old_sizes) {
		this.button = new Button("LEAVE", canvas.width * 0.015, canvas.height * 0.9, canvas.width * 0.11, canvas.height * 0.07);
		this.size = [canvas.width * 0.2, canvas.height * 0.4]
		this.visual = [new Button("", -(canvas.width * 0.05), canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true)];
		let tmp = this.start_names / old_sizes[1];
		this.start_names = tmp * canvas.height;
		tmp = this.init_pos / old_sizes[1];
		this.init_pos = tmp * canvas.height;
		this.size[1] = (this.max_players <= 20) ? canvas.height * 0.04 * this.max_players : canvas.height * 0.04 * 20;
		this.visual.push(new Button("", canvas.width * 0.85, canvas.height / 2 - (this.size[1] / 2), this.size[0], this.size[1], true));
		if (this.max_players > 20) {
			this.arrows = [new Arrow("", canvas.width * 0.977, canvas.height / 2 - (this.size[1] * 0.49), canvas.width * 0.02, canvas.height * 0.02, "up"),
							new Arrow("", canvas.width * 0.977, canvas.height / 2 + (this.size[1] * 0.465), canvas.width * 0.02, canvas.height * 0.02, "down")];
		}
		const spec_size = [canvas.width  * 0.65, canvas.height * 0.65];
		this.spec_screen = new Button("", (canvas.width / 2) - (spec_size[0] / 2), (canvas.height / 2) - (spec_size[1] / 2), spec_size[0], spec_size[1], true);
	}
}