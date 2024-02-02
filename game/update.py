from .config import *
from .AI import *

def update_all(core, delta):
	if core.state == "game" and not core.pause[1].freeze:
		core.ball.update(core.walls, core.players, delta)
		if core.mode == "solo":
			core.ai.update(core, core.players[1])

		for player in core.players:
			if player.score == core.max_score:
				core.state = "end"
				player.win = "WIN"
			player.speed = speed_per_sec * delta
	if core.state == "start":
		core.start_screen.update()
		if core.start_screen.timer == 0:
			core.state = "game"
