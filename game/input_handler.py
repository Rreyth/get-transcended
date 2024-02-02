from .config import *

def input_handler(core):
	if core.state == "end":
		end_input(core)
	elif core.state == "menu":
		menu_input(core)
	elif core.state == "game" and not core.pause[0]:
		if core.mode == "local":
			input_handler_2p(core, core.players)
		elif core.mode == "solo":
			input_handler_1p(core, core.players[0])
			input_handler_ai(core, core.players[1])
	elif core.pause[0]:
		pause_input(core)

def end_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		core.end.click(core, core.mousePos)

def menu_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		core.menu.click(core, core.mousePos)

def pause_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		core.pause[1].click(core, core.mousePos)

def	input_handler_1p(core, player):
	if core.keyboardState[pg.K_UP] or core.keyboardState[pg.K_w]:
		player.moveUp(core.walls[0].hitbox)
	if core.keyboardState[pg.K_DOWN] or core.keyboardState[pg.K_s]:
		player.moveDown(core.walls[1].hitbox)
	if core.keyboardState[pg.K_SPACE] and core.ball.stick == player.nb:
		core.ball.launch()
  
def input_handler_ai(core, ai):
	pass
	if core.keyboardState[pg.K_KP8]:
		ai.moveUp(core.walls[0].hitbox)
	if core.keyboardState[pg.K_KP2]:
		ai.moveDown(core.walls[1].hitbox)
	if core.keyboardState[pg.K_KP5] and core.ball.stick == ai.nb:
		core.ball.launch()

def	input_handler_2p(core, players):
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

def escape_handler(core):
	if core.state == "menu" or core.state == "end":
		core.quit()
	if core.state == "game":
		core.pause[0] = not core.pause[0]
		if core.mode != "ONLINE" and core.pause[0]:
			core.pause[1].freeze = True
		else:
			core.pause[1].freeze = False
