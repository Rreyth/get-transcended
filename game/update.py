from .config import *
from .AI import *
from .Ball import *

def update_all(core, delta):
	if core.state == "game" and not core.pause[1].freeze:
		update_ball(core, delta)

		for ai in core.ai:
			ai.update(core, core.players[1]) #modif ai pour appel en loop avec les bons params

		for player in core.players:
			if player.score == core.max_score and core.max_score != 0:
				core.state = "end"
				player.win = "WIN"
			player.speed = speed_per_sec * delta
	if core.state == "start":
		core.start_screen.update()
		if core.start_screen.timer == 0:
			core.state = "game"

def update_ball(core, delta):
	if core.ball.hitbox.top < 0 or core.ball.hitbox.bottom >= winHeight:
		core.ballcpy = Ball()
		core.ballcpy.copy(core.ball)
		if core.ballcpy.hitbox.top < 0:
			core.ballcpy.hitbox.centery += winHeight
		elif core.ballcpy.hitbox.bottom >= winHeight:
			core.ballcpy.hitbox.centery -= winHeight
		init_dir = core.ballcpy.dir
		core.ball.update(core.walls, core.players, delta)
		core.ballcpy.update(core.walls, core.players, delta)

		if core.ballcpy.dir != init_dir and core.ball.dir == init_dir:
			core.ball.dir = core.ballcpy.dir

	else:
		core.ballcpy = False
		core.ball.update(core.walls, core.players, delta)