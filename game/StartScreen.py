import time
from .config import *
from .Button import *

#mode pour modif quoi afficher et ou
 #adapt to nb players
class StartScreen:
	def __init__(self, mode):
		self.state = True
		self.mode = mode
		self.timer = 3
		self.time = time.time()
		self.font = pg.font.Font(font, int(winHeight * 0.085))
		self.size = [150, 100]
		self.player_input = []
		if mode == "LOCAL":
			self.player_input = [Button("W", (winWidth / 4) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("S", (winWidth / 4) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("Space", (winWidth / 4) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("UP", (winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("DOWN", (winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("LEFT", (winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]

		elif mode == "solo":
			self.player_input = [Button("W", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("S", (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("Space", (winWidth / 5) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("UP", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                        Button("DOWN", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]

	def draw(self, win):
		for button in self.player_input:
			button.draw(win)
		timer = self.font.render(str(self.timer), True, (255, 255, 255))
		win.blit(timer, ((winWidth / 2) - (timer.get_size()[0] / 2), (winHeight / 2) - (timer.get_size()[1] / 2)))
  
	def update(self):
		tmp = time.time()
		delta = tmp - self.time
		if delta >= 1:
			self.time = tmp
			self.timer -= 1
