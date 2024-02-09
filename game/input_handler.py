from .config import *

def input_handler(core):
	if core.state == "game" and not core.pause[0]:
		if core.mode == "LOCAL":
			if core.players.__len__() == 2:
				input_handler_2p(core, core.players)
			elif core.custom_mod == "1V1V1V1":
				input_handler_square(core, core.players)
			elif core.players.__len__() == 4: #modif pour ia 
				input_handler_4p(core, core.players)
		elif core.mode == "solo":
			input_handler_1p(core, core.players[0])
			input_handler_ai(core, core.players[1])
	

def mouse_handler(core):
	if core.state == "end":
		end_input(core)
	elif core.state == "menu":
		menu_input(core)
	elif core.pause[0]:
		pause_input(core)
	elif core.state == "custom":
		custom_input(core)


def custom_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		core.custom_menu.click(core, core.mousePos)

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
		player.moveUp(core.walls)
	if core.keyboardState[pg.K_DOWN] or core.keyboardState[pg.K_s]:
		player.moveDown(core.walls)
	if core.keyboardState[pg.K_SPACE] and core.ball.stick == player.nb:
		core.ball.launch()
  
def input_handler_ai(core, ai): # standby, when client version, launch msg to serv
	if core.keyboardState[pg.K_KP8]:
		ai.moveUp(core.walls)
	if core.keyboardState[pg.K_KP2]:
		ai.moveDown(core.walls)
	if core.keyboardState[pg.K_KP5] and core.ball.stick == ai.nb:
		core.ball.launch()

def	input_handler_2p(core, players):
	if core.keyboardState[pg.K_w]:
		players[0].moveUp(core.walls)
	if core.keyboardState[pg.K_s]:
		players[0].moveDown(core.walls)
	if core.keyboardState[pg.K_UP]:
		players[1].moveUp(core.walls)
	if core.keyboardState[pg.K_DOWN]:
		players[1].moveDown(core.walls)
	if core.keyboardState[pg.K_SPACE] and core.ball.stick == 1:
		core.ball.launch()
	if core.keyboardState[pg.K_LEFT] and core.ball.stick == 2:
		core.ball.launch()

def	input_handler_4p(core, players):
	if core.keyboardState[pg.K_w]:
		players[0].moveUp(core.walls)
	if core.keyboardState[pg.K_s]:
		players[0].moveDown(core.walls)
	if core.keyboardState[pg.K_t]:
		players[1].moveUp(core.walls)
	if core.keyboardState[pg.K_g]:
		players[1].moveDown(core.walls)
	if core.keyboardState[pg.K_UP]:
		players[3].moveUp(core.walls)
	if core.keyboardState[pg.K_DOWN]:
		players[3].moveDown(core.walls)
	if core.keyboardState[pg.K_KP8]:
		players[2].moveUp(core.walls)
	if core.keyboardState[pg.K_KP5]:
		players[2].moveDown(core.walls)
	if core.keyboardState[pg.K_SPACE] and (core.ball.stick == 1 or core.ball.stick == 2):
		core.ball.launch()
	if (core.keyboardState[pg.K_LEFT] or core.keyboardState[pg.K_KP4]) and (core.ball.stick == 3 or core.ball.stick == 4):
		core.ball.launch()

def input_handler_square(core, players):
	if core.keyboardState[pg.K_w]:
		players[0].moveUp(core.walls)
	if core.keyboardState[pg.K_s]:
		players[0].moveDown(core.walls)
	if core.keyboardState[pg.K_e] and core.ball.stick == 1:
		core.ball.launch()
	if core.keyboardState[pg.K_UP]:
		players[1].moveUp(core.walls)
	if core.keyboardState[pg.K_DOWN]:
		players[1].moveDown(core.walls)
	if core.keyboardState[pg.K_LEFT] and core.ball.stick == 2:
		core.ball.launch()
	if core.keyboardState[pg.K_t]:
		players[2].moveLeft(core.walls)
	if core.keyboardState[pg.K_y]:
		players[2].moveRight(core.walls)
	if core.keyboardState[pg.K_h] and core.ball.stick == 3:
		core.ball.launch()
	if core.keyboardState[pg.K_k]:
		players[3].moveLeft(core.walls)
	if core.keyboardState[pg.K_l]:
		players[3].moveRight(core.walls)
	if core.keyboardState[pg.K_o] and core.ball.stick == 4:
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
	if core.state == "custom":
		core.state = "menu"
		core.mode = "none"
