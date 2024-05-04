from .config import *
import string
from .Vec2 import *

async def input_id(core, button, key, code):
	set = string.ascii_letters + string.digits
	if code in set and button.name.__len__() < 4:
		button.name += code.upper()
	elif key == pg.K_BACKSPACE:
		button.name = button.name[:-1]
	elif key == pg.K_RETURN or key == pg.K_KP_ENTER:
		await core.menu.setValues("JOIN", core)

def online_input(core):
	if core.state == "game":
		if core.players[core.id - 1].side == "left" or core.players[core.id - 1].side == "right":
			if core.keyboardState[pg.K_UP] or core.keyboardState[pg.K_w]:
				core.pressed.append("UP")
				core.players[core.id - 1].moveUp(core.walls)
			if core.keyboardState[pg.K_DOWN] or core.keyboardState[pg.K_s]:
				core.pressed.append("DOWN")
				core.players[core.id - 1].moveDown(core.walls)
		if core.players[core.id - 1].side == "up" or core.players[core.id - 1].side == "down":
			if core.keyboardState[pg.K_LEFT] or core.keyboardState[pg.K_a]:
				core.pressed.append("LEFT")
				core.players[core.id - 1].moveLeft(core.walls)
			if core.keyboardState[pg.K_RIGHT] or core.keyboardState[pg.K_d]:
				core.pressed.append("RIGHT")
				core.players[core.id - 1].moveRight(core.walls)
		if core.keyboardState[pg.K_SPACE] and core.ball.stick == core.id:
			core.pressed.append("LAUNCH")
			core.ball.launch()
	if core.mode == 'solo':
		core.pressed = []
		ai_moves(core, core.players[1])

def input_handler(core):
	if core.online or (core.mode == "solo" and not core.pause[0]):
		online_input(core)
	else:
		if core.state == "game" and not core.pause[0]:
			for player in core.players:
				if player.name == 'AI':
					ai_moves(core, player)
				else:
					player_moves(core, player)


async def mouse_handler(core):
	if core.state == "end":
		await end_input(core)
	elif core.state == "menu":
		await menu_input(core)
	elif core.pause[0]:
		await pause_input(core)
	elif core.state == "custom":
		await custom_input(core)
	elif core.state == 'waiting':
		if core.mouseState[0] and pg.mouse.get_focused():
			await core.wait_screen.click(core, core.mousePos)

async def custom_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		await core.custom_menu.click(core, core.mousePos)

async def end_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		await core.end.click(core, core.mousePos)

async def menu_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		await core.menu.click(core, core.mousePos)

async def pause_input(core):
	if core.mouseState[0] and pg.mouse.get_focused():
		await core.pause[1].click(core, core.mousePos)


def ai_moves(core, player):
	for ai in core.ai:
		if ai.id == player.nb:
			for move in ai.moves:
				if move == "UP":
					player.moveUp(core.walls)
				elif move == "DOWN":
					player.moveDown(core.walls)
				elif move == "LEFT":
					player.moveLeft(core.walls)
				elif move == "RIGHT":
					player.moveRight(core.walls)
				elif move == "LAUNCH" and core.ball.stick == player.nb:
					core.ball.launch()
			ai.pos = Vec2(pos=player.paddle[0].pos)
			ai.moves = []
			break

def player_moves(core, player):
	if player.side == 'left':
		if player.nb == 1:
			if core.keyboardState[pg.K_w]:
				player.moveUp(core.walls)
			if core.keyboardState[pg.K_s]:
				player.moveDown(core.walls)
		else:
			if core.keyboardState[pg.K_t]:
				player.moveUp(core.walls)
			if core.keyboardState[pg.K_g]:
				player.moveDown(core.walls)
		if core.keyboardState[pg.K_SPACE] and core.ball.stick == player.nb:
			core.ball.launch()
	elif player.side == 'right':
		if player.nb == 2 or player.nb == 4:
			if core.keyboardState[pg.K_UP]:
				player.moveUp(core.walls)
			if core.keyboardState[pg.K_DOWN]:
				player.moveDown(core.walls)
		else:
			if core.keyboardState[pg.K_KP8]:
				player.moveUp(core.walls)
			if core.keyboardState[pg.K_KP5]:
				player.moveDown(core.walls)
		if core.keyboardState[pg.K_KP_0] and core.ball.stick == player.nb:
			core.ball.launch()
	elif player.side == 'up':
		if core.keyboardState[pg.K_t]:
			player.moveLeft(core.walls)
		if core.keyboardState[pg.K_y]:
			player.moveRight(core.walls)
		if core.keyboardState[pg.K_h] and core.ball.stick == player.nb:
			core.ball.launch()
	elif player.side == 'down':
		if core.keyboardState[pg.K_k]:
			player.moveLeft(core.walls)
		if core.keyboardState[pg.K_l]:	
			player.moveRight(core.walls)
		if core.keyboardState[pg.K_o] and core.ball.stick == player.nb:
			core.ball.launch()


async def escape_handler(core):
	if core.state == "menu" or core.state == "end":
		await core.quit()
	if core.state == "game":
		core.pause[0] = not core.pause[0]
		if not core.online and core.pause[0]:
			core.pause[1].freeze = True
		else:
			core.pause[1].freeze = False
	if core.state == "custom":
		core.state = "menu"
		core.mode = "none"
		core.max_score = 10
