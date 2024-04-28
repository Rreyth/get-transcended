from .config import *
from .AI import *
from .Ball import *

async def update_all(core, delta):
	if core.state == "game" and not core.pause[1].freeze:

		core.ball.update(core, delta)
		if core.obstacle and not core.online:
			core.obstacle.update()

		if not core.online:
			for ai in core.ai:
				ai.update(core, delta)

		for player in core.players:
			if not core.online and player.score == core.max_score and core.max_score != 0:
				core.state = "end"
				player.win = "WIN"
			player.update(delta)
		if core.state == "end" and not core.online:
			await core.GameHub.send(json.dumps(core.endMsg('end')))

	if core.state == "start":
		if not core.online:
			core.start_screen.update()
		if core.start_screen.timer == 0:
			core.state = "game"
