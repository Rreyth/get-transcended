from .config import *

def	input_handler(core, player):
	if core.keyboardState[pg.K_ESCAPE]:
		core.quit()
	if core.keyboardState[pg.K_UP] or core.keyboardState[pg.K_w]:
		player.moveUp(core.walls[0].hitbox)
	if core.keyboardState[pg.K_DOWN] or core.keyboardState[pg.K_s]:
		player.moveDown(core.walls[1].hitbox)
	if core.keyboardState[pg.K_SPACE] and core.ball.stick:
		core.ball.launch()
  
  
def	input_handler_2p(core, players):
	if core.keyboardState[pg.K_ESCAPE]:
		core.quit()
	if core.keyboardState[pg.K_w]:
		players[0].moveUp(core.walls[0].hitbox)
	if core.keyboardState[pg.K_s]:
		players[0].moveDown(core.walls[1].hitbox)
	if core.keyboardState[pg.K_UP]:
		players[1].moveUp(core.walls[0].hitbox)
	if core.keyboardState[pg.K_DOWN]:
		players[1].moveDown(core.walls[1].hitbox)
	if core.keyboardState[pg.K_SPACE] and core.ball.stick == 1:
		core.ball.launch()
	if core.keyboardState[pg.K_LEFT] and core.ball.stick == 2:
		core.ball.launch()
