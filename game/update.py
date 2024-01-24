from .config import *

def update_all(core, delta):
	if core.state == "game":
		core.ball.update(core.walls, core.players, delta)
 
		for player in core.players:
			if player.score == core.max_score:
				core.state = "end"
			player.speed = speed_per_sec * delta
	