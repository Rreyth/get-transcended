from config import *

async def update_all(core, delta):
	if core.state == "game":
		core.ball.update(core, delta)

		if core.obstacle:
			core.obstacle.update()

		for ai in core.ai:
			ai.update(core, delta)

		for player in core.players:
			if player.score == core.max_score and core.max_score != 0:
				core.state = "end"
				player.win = "WIN"
			player.speed = player.speed_per_sec * delta
   
		if core.state == "end" and core.tournament:
			core.state = "tournament"
			await core.tournament.endMatch(core.players, core)

		if core.state == "end":
			await core.hub[0].send(json.dumps(core.endMsg(0, 'end')))
			await core.sendAll(core.endMsg(0, 'end'))
			core.is_running = False
			await core.closeAll()

	if core.state == "start":
		tmp = time.time()
		d = tmp - core.start[1]
		if d >= 1:
			core.start[1] = tmp
			core.start[0] -= 1
		if core.start[0] == 0:
			core.state = "game"

	if core.state == "tournament":
		await core.tournament.update(core)