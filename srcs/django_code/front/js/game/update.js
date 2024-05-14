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
		if (core.state === "end" && core.tournament && !core.online) {
			core.state = "tournament";
			core.tournament.endMatch(core.players);
		}
		if (core.state == "end" && !core.online)
			core.GameHub.send(JSON.stringify(core.endMsg("end")));
	}

	if (core.state === "start") {
		if (!core.online)
			core.start_screen.update();
		if (core.start_screen.timer === 0)
			core.state = "game";
	}
	if (core.state === "tournament" && !core.online) {
		core.tournament.update(core);
	}
}

export function update_sizes(core, old_sizes) {
	core.menu.responsive();
	core.pause[1].responsive();
	core.end.responsive();
	if (core.custom_menu)
		core.custom_menu.responsive();
	if (core.wait_screen)
		core.wait_screen.responsive();
	if (core.start_screen)
		core.start_screen.responsive();
	if (core.ball)
		core.ball.responsive(old_sizes);
	if (core.players) {
		for (let player of core.players)
			player.responsive(old_sizes);
		for (let ai of core.ai)
			ai.responsive(core.players, old_sizes);
	}
	if (core.walls)
		for (let wall of core.walls)
			wall.responsive();
	if (core.obstacle)
		core.obstacle.responsive();
	if (core.tournament_menu)
		core.tournament_menu.responsive();
	if (core.tournament) {
		core.tournament.responsive(old_sizes);
		if (core.tournament.state === "ongoing")
			core.tournament.resizeSpec(core);
	}
	core.render();
}