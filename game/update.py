from .config import *

def update_all(core, delta):
    
	for player in core.players:
		player.speed = speed_per_sec * delta

	core.ball.update(core.walls, core.players, delta)