from .config import *
from .Ball import *
from .Button import *
from .Player import *
from .Wall import *
from .StartScreen import *
from .AI import *

class CustomMenu: #modif max score (fleches?)/ time ? nb players ? / mode selected pour highlight le mode selectionne
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
            	Button("1 VS 1 VS 1", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 4 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
		self.mod_buttons = [Button("LOCAL", winWidth / 5 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
              	Button("ONLINE", winWidth / 5 * 2 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
          		Button("BORDERLESS", winWidth / 5 * 3 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
            	Button("POWER UPS", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 2 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
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


	def start(self, core):
		if not self.validStart():
			return
		core.max_score = self.score
		self.initPlayers(core)
		self.initWalls(core)
		core.ball = Ball()
		core.ballcpy = False
		core.state = "start"
		core.mode = "local" #changer pour custom
		core.start_screen = StartScreen(core.mode)

	def initPlayers(self, core):
		if self.players_buttons[0].highlight:
			core.players = [Player(1, "AI"), Player(2, "AI")]
			core.ai.append(AI(core.players[0]))
			core.ai.append(AI(core.players[1]))
		if self.players_buttons[1].highlight:
			core.players = [Player(1, "Player1"), Player(2, "Player2")]
		if self.players_buttons[2].highlight:
			core.players = [Player(1, "Player1"), Player(2, "Player2")] #replace with 2v2
		if self.players_buttons[3].highlight:
			core.players = [Player(1, "Player1"), Player(2, "Player2")] #replace with 1v1v1 triangle

	def initWalls(self, core):
		if self.mod_buttons[2].highlight:
			core.walls = False
		else:
			core.walls = [Wall("up"), Wall("down")]

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