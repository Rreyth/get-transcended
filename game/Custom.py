from .config import *
from .Ball import *
from .Button import *
from .Player import *
from .Wall import *
from .StartScreen import *
from .AI import *
from .Obstacle import *

class CustomMenu:
	def __init__(self):
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.mod_size = [winWidth * 0.09, winHeight * 0.05]
		self.font = pg.font.Font(font, int(winHeight * 0.06))
		self.score = 5
		self.down_buttons = [Button("BACK TO MENU", 25, winHeight - self.size[1] - 25, self.size[0], self.size[1], winHeight * 0.085),
				Button("START", winWidth - self.size[0] - 25, winHeight - self.size[1] - 25, self.size[0], self.size[1], winHeight * 0.085)]
		self.players_buttons = [Button("AI VS AI", winWidth / 5 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
       			Button("1 VS 1", winWidth / 5 * 2 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
          		Button("2 VS 2", winWidth / 5 * 3 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
            	Button("1V1V1V1", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
		self.mod_buttons = [Button("LOCAL", winWidth / 5 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
              	Button("ONLINE", winWidth / 5 * 2 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
          		Button("BORDERLESS", winWidth / 5 * 3 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
            	Button("AI OPPONENT", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
		self.param_buttons = [Button("-", winWidth / 2 + 35, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("+", winWidth / 2 + 65, winHeight / 4 * 3 - (winHeight * 0.03 / 2), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06)]
		self.players_buttons[1].highlight = True
		self.mod_buttons[0].highlight = True
	
	def draw(self, win):
		score = self.font.render("MAX SCORE = " + str(self.score), True, (255, 255, 255))
		win.blit(score, (winWidth / 2 - 200, winHeight / 4 * 3 - score.get_size()[1] * 0.45))
		for button in self.down_buttons:
			button.draw(win)
		for button in self.players_buttons:
			button.draw(win)
		for button in self.mod_buttons:
			button.draw(win)
		for button in self.param_buttons:
			button.draw(win)

	def click(self, core, mousePos):
		for button in self.down_buttons:
			if button.hitbox.collidepoint(mousePos):
				if button.name == "BACK TO MENU":
					core.state = "menu"
					core.mode = "none"
					break
				elif button.name == "START":
					self.start(core)
					break

		for button in self.players_buttons:
			if button.hitbox.collidepoint(mousePos):
				if not button.highlight:
					for other in self.players_buttons:
						other.highlight = False
				button.highlight = not button.highlight
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
				if button.name == "+":
					self.score += 1
				elif button.name == "-" and self.score > 0:
					self.score -= 1
				break

		if self.players_buttons[0].highlight:
			self.mod_buttons[0].highlight = True
			self.mod_buttons[1].highlight = False
			self.mod_buttons[3].highlight = True
		elif self.players_buttons[1].highlight and self.mod_buttons[3].highlight:
			self.mod_buttons[0].highlight = True
			self.mod_buttons[1].highlight = False
		elif self.players_buttons[3].highlight:
			self.mod_buttons[2].highlight = False


	def start(self, core):
		if not self.validStart():
			return
		self.getMods()
		core.max_score = self.score
		self.initPlayers(core)
		self.initWalls(core)
		core.ball = Ball(True if "BORDERLESS" in self.mod_list else False)
		core.state = "start"
		if "AI OPPONENT" in self.mod_list and self.players_buttons[1].highlight:
			core.mode = "solo"
		elif self.players_buttons[0].highlight:
			core.mode = "AI"
		else:
			core.mode = self.mod_list[0]
		if "1V1V1V1" in self.mod_list:
			core.custom_mod = "1V1V1V1"
			core.obstacle = Obstacle()
		core.start_screen = StartScreen(core.mode) #adapt to nb players

	def getMods(self):
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
					self.players[1] = "Player1"
					if "AI OPPONENT" in self.mod_list:
						self.players[2] = "AI"
					else:
						self.players[2] = "Player2"
					break
				elif button.name == "2 VS 2":
					self.players[1] = "Player1"
					self.players[2] = "Player2"
					if "AI OPPONENT" in self.mod_list:
						self.players[3] = "AI"
						self.players[4] = "AI"
					else:
						self.players[3] = "Player3"
						self.players[4] = "Player4"
					break
				elif button.name == "1V1V1V1":
					self.mod_list.append(button.name)
					self.players[1] = "Player1"
					self.players[2] = "Player2"
					self.players[3] = "Player3"
					self.players[4] = "Player4"
					# if "AI OPPONENT" in self.mod_list:
					# 	self.players[3] = "AI"
					# else:
					# 	self.players[3] = "Player3"

      
	def initPlayers(self, core):
		core.players = []
		for key, name in self.players.items():
			core.players.append(Player(key, name, self.players.__len__(), True if "BORDERLESS" in self.mod_list else False, True if "1V1V1V1" in self.mod_list else False))
		if self.players_buttons[0].highlight:
			core.ai.append(AI(core.players[0]))
			core.ai.append(AI(core.players[1]))
		elif "AI OPPONENT" in self.mod_list:
			if self.players.__len__() == 2 or self.players.__len__() == 3:
				core.ai.append(AI(core.players[self.players.__len__() - 1]))
			else:
				core.ai.append(AI(core.players[2]))
				core.ai.append(AI(core.players[3]))

	def initWalls(self, core):
		if self.mod_buttons[2].highlight:
			core.walls = False
		elif self.players_buttons[3].highlight:
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