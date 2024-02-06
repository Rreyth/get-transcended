from .config import *
from .Ball import *
from .Button import *
from .Player import *
from .Wall import *
from .StartScreen import *

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
		interact = False
		for button in self.down_buttons:
			if button.hitbox.collidepoint(mousePos):
				interact = True
				if button.name == "BACK TO MENU":
					core.state = "menu"
					core.mode = "none"
					break
				elif button.name == "START":
					self.start(core)
					break
		if interact:
			return
		for button in self.players_buttons:
			if button.hitbox.collidepoint(mousePos):
				interact = True
				if not button.highlight:
					for other in self.players_buttons:
						other.highlight = False
				button.highlight = not button.highlight
				break
		if interact:
			return
		for button in self.mod_buttons:
			if button.hitbox.collidepoint(mousePos):
				interact = True
				if button.name == "LOCAL" and not button.highlight:
					self.mod_buttons[1].highlight = False
				if button.name == "ONLINE" and not button.highlight:
					self.mod_buttons[0].highlight = False
				button.highlight = not button.highlight
				break
		if interact:
			return
		for button in self.param_buttons:
			if button.hitbox.collidepoint(mousePos):
				if button.name == "+":
					self.score += 1
				elif button.name == "-" and self.score > 0:
					self.score -= 1
				break


	def start(self, core):
		core.max_score = self.score
		# core.players = self.players
		# core.walls = self.walls
		core.players = [Player(1, "Player1"), Player(2, "Player2")]
		core.walls = [Wall("up"), Wall("down")]
		core.ball = Ball()
		core.state = "start"
		core.mode = "local" #changer pour custom
		core.start_screen = StartScreen(core.mode)