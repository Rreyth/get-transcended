import { AI } from "./AI.js";
import { Ball } from "./Ball.js";

export function update_all(core, delta) {
	if (core.state === "game" && !core.pause[1].freeze) {
		core.ball.update(core, delta);
		
		if (core.obstacle && !core.online)
			core.obstacle.update();

		if (!core.online)
			for (let ai of core.ai)
				ai.update(core, delta);
		
		for (let player of core.players) {
			if (!core.online && player.score == core.max_score && core.max_score !== 0) {
				core.state = "end";
				player.win = "WIN";
			}
			player.update(delta);
		}
		// if (core.state == "end" && !core.online)
			// await core.GameHub.send(json.dumps(core.endMsg('end')))
	}

	if (core.state === "start") {
		if (!core.online)
			core.start_screen.update();
		if (core.start_screen.timer === 0)
			core.state = "game";
	}
}