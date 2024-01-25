from .config import *

def update_all(core, delta):
	if core.state == "game" and not core.pause[1].freeze:
		core.ball.update(core.walls, core.players, delta)
 
		for player in core.players:
			if player.score == core.max_score:
				core.state = "end"
				player.win = "WIN"
			player.speed = speed_per_sec * delta
	