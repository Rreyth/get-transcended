from .config import *

def	input_handler(core, player):
	if core.keyboardState[pg.K_ESCAPE]:
		core.quit()
	if core.keyboardState[pg.K_UP] or core.keyboardState[pg.K_w]:
		player.moveUp(core.walls[0].hitbox)
	if core.keyboardState[pg.K_DOWN] or core.keyboardState[pg.K_s]:
		player.moveDown(core.walls[1].hitbox)