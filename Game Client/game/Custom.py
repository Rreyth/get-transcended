from .config import *
from .Ball import *
from .Button import *
from .Player import *
from .Wall import *
from .StartScreen import *
from .AI import *
from .Obstacle import *
from .WaitScreen import *

class CustomMenu:
	def __init__(self):
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.mod_size = [winWidth * 0.11, winHeight * 0.07]
		self.font = pg.font.Font(font, int(winHeight * 0.06))
		self.title_font = pg.font.Font(font, int(winHeight * 0.085))
		self.score = 10
		self.ai_nb = 0
		self.max_ai = 2
		self.down_buttons = [Button("BACK TO MENU", 25, winHeight - self.size[1] - 25, self.size[0], self.size[1], winHeight * 0.085),
				Button("START", winWidth - self.size[0] - 25, winHeight - self.size[1] - 25, self.size[0], self.size[1], winHeight * 0.085)]
		self.players_buttons = [Button("AI VS AI", winWidth / 5 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
       			Button("1 VS 1", winWidth / 5 * 2 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
          		Button("2 VS 2", winWidth / 5 * 3 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
            	Button("1V1V1V1", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
		self.mod_buttons = [Button("LOCAL", winWidth / 5 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
              	Button("ONLINE", winWidth / 5 * 2 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
          		Button("BORDERLESS", winWidth / 5 * 3 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
            	Button("OBSTACLE", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
		# self.param_buttons = [Button("-", winWidth / 2 + 125, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
		# 		Button("+", winWidth / 2 + 155, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
    	# 		Button("-", (winWidth / 5 * 4) + 140, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
		# 		Button("+", (winWidth / 5 * 4) + 170, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06)] # old pos
		self.param_buttons = [Button("-", winWidth / 3 + 125, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("+", winWidth / 3 + 155, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("-", winWidth / 3 * 2 + 140, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("+", winWidth / 3 * 2 + 170, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06)]
		self.players_buttons[1].highlight = True
		self.mod_buttons[0].highlight = True
	
	def draw(self, win):
		title = self.title_font.render("CUSTOM", True, (255, 255, 255))
		win.blit(title, (winWidth / 2 - (title.get_size()[0] / 2), winHeight * 0.1 - title.get_size()[1] * 0.45))
		score = self.font.render("MAX SCORE = " + str(self.score), True, (255, 255, 255))
		win.blit(score, (winWidth / 3 - (score.get_size()[0] / 2), winHeight / 4 * 3 - score.get_size()[1] * 0.45))
		# win.blit(score, (winWidth / 2 - (score.get_size()[0] / 2), winHeight / 4 * 3 - score.get_size()[1] * 0.45)) #center
		ai = self.font.render("AI OPPONENTS = " + str(self.ai_nb), True, (255, 255, 255))
		win.blit(ai, (winWidth / 3 * 2 - (ai.get_size()[0] / 2), winHeight / 4 * 3 - ai.get_size()[1] * 0.45))
		# win.blit(ai, (winWidth / 5 * 4 - (ai.get_size()[0] / 2), winHeight / 4 * 3 - ai.get_size()[1] * 0.45)) #right
		for button in self.down_buttons:
			button.draw(win)
		for button in self.players_buttons:
			button.draw(win)
		for button in self.mod_buttons:
			button.draw(win)
		for button in self.param_buttons:
			button.draw(win)

	async def click(self, core, mousePos):
		for button in self.down_buttons:
			if button.hitbox.collidepoint(mousePos):
				if button.name == "BACK TO MENU":
					core.state = "menu"
					core.mode = "none"
					core.max_score = 10
					break
				elif button.name == "START":
					await self.start(core)
					break

		for button in self.players_buttons:
			if button.hitbox.collidepoint(mousePos):
				if not button.highlight:
					for other in self.players_buttons:
						other.highlight = False
				button.highlight = not button.highlight
				self.max_ai = 2 if button.name == "AI VS AI" or button.name == "1 VS 1" else 4
				self.ai_nb = 0
				break

		for button in self.mod_buttons:
			if button.hitbox.collidepoint(mousePos):
				if button.name == "LOCAL" and not button.highlight:
					self.mod_buttons[1].highlight = False
				if button.name == "ONLINE" and not button.highlight:
					self.mod_buttons[0].highlight = False
				button.highlight = not button.highlight
				break

		for button in self.param_buttons:
			if button.hitbox.collidepoint(mousePos):
				if button == self.param_buttons[0] or button == self.param_buttons[1]:
					if button.name == "+":
						self.score += 1
					elif button.name == "-" and self.score > 0:
						self.score -= 1
				else:
					if button.name == "+" and self.ai_nb < self.max_ai:
						self.ai_nb += 1
					elif button.name == "-" and self.ai_nb > 0:
						self.ai_nb -= 1
				break

		if self.players_buttons[0].highlight:
			self.mod_buttons[0].highlight = True
			self.mod_buttons[1].highlight = False
			self.ai_nb = 2
		elif self.players_buttons[1].highlight and self.ai_nb > 0:
			self.mod_buttons[0].highlight = True
			self.mod_buttons[1].highlight = False
		elif self.players_buttons[3].highlight:
			self.mod_buttons[2].highlight = False
   
		if self.players_buttons[2].highlight or self.players_buttons[3].highlight:
			if self.ai_nb >= 3:
				self.mod_buttons[0].highlight = True
				self.mod_buttons[1].highlight = False


	async def start(self, core):
		if not self.validStart():
			return
		self.getMods(core.alias)
		core.max_score = self.score
		if "LOCAL" in self.mod_list:
			self.initPlayers(core)
			self.initWalls(core)
			core.ball = Ball(True if "BORDERLESS" in self.mod_list else False)
			core.state = "start"
			core.mode = "LOCAL"
			if "OBSTACLE" in self.mod_list:
				core.obstacle = Obstacle()
			msg = {"type" : 'custom', 'online' : 'false'}
			await core.GameHub.send(json.dumps(msg))
		elif "ONLINE" in self.mod_list:
			core.mode = "ONLINE"
			msg = {"type" : 'custom', 'online' : 'true', 'mods' : self.mod_list, 'score' : self.score, 'ai' : self.ai_nb, 'players' : self.players.__len__()}
			await core.GameHub.send(json.dumps(msg))
			response : dict = json.loads(await core.GameHub.recv())
			core.GameSocket = response['socket']
			core.id = response['pos']
			core.state = "waiting"
			core.online = True
			core.wait_screen = WaitScreen(response['ID'], core.id, self.players.__len__(), "CUSTOM")
		if "1V1V1V1" in self.mod_list:
			core.custom_mod = "1V1V1V1"

		core.start_screen = StartScreen('custom', core.online, True if "1V1V1V1" in self.mod_list else False, self.players.__len__())

	def getMods(self, alias = 'Player'):
		self.mod_list = []
		for button in self.mod_buttons:
			if button.highlight:
				self.mod_list.append(button.name)
		
		self.players = {}
		for button in self.players_buttons:
			if button.highlight:
				if button.name == "AI VS AI":
					self.players[1] = "AI"
					self.players[2] = "AI"
					break
				elif button.name == "1 VS 1":
					self.players[1] = alias + "1" if self.ai_nb < 2 else "AI"
					self.players[2] = alias + "2" if self.ai_nb < 1 else "AI"
					break
				elif button.name == "2 VS 2":
					self.players[1] = alias + "1" if self.ai_nb < 4 else "AI"
					self.players[2] = alias + "2" if self.ai_nb < 3 else "AI"
					self.players[3] = alias + "3" if self.ai_nb < 2 else "AI"
					self.players[4] = alias + "4" if self.ai_nb < 1 else "AI"
					break
				elif button.name == "1V1V1V1":
					self.mod_list.append(button.name)
					self.players[1] = alias + "1" if self.ai_nb < 4 else "AI"
					self.players[2] = alias + "2" if self.ai_nb < 3 else "AI"
					self.players[3] = alias + "3" if self.ai_nb < 2 else "AI"
					self.players[4] = alias + "4" if self.ai_nb < 1 else "AI"

      
	def initPlayers(self, core):
		core.players = []
		for key, name in self.players.items():
			core.players.append(Player(key, name, self.players.__len__(), True if "BORDERLESS" in self.mod_list else False, True if "1V1V1V1" in self.mod_list else False))
		for player in core.players:
			if player.name == "AI":
				core.ai.append(AI(player))


	def initWalls(self, core):
		if "BORDERLESS" in self.mod_list:
			core.walls = False
		elif "1V1V1V1" in self.mod_list:
			core.walls = [Wall("up", True), Wall("down", True), Wall("left", True), Wall("right", True)]
		else:
			core.walls = [Wall("up", False), Wall("down", False)]

	def validStart(self):
		selected = False
		for button in self.players_buttons:
			if button.highlight:
				selected = True
				break
		if not selected:
			return False
		selected = False
		for button in self.mod_buttons:
			if button.name == "LOCAL" and button.highlight:
				selected = True
				break
			if button.name == "ONLINE" and button.highlight:
				selected = True
				break
		if not selected:
			return False
		return True