import time
from .config import *

class StartScreen:
	def __init__(self, mode): #mode pour modif quoi afficher et ou
		self.state = True
		self.timer = 3
		self.time = time.time()
		self.font = pg.font.Font(font, int(winHeight * 0.085))
		self.size = [150, 100]
		self.player_input = {
			"W": pg.Rect(((winWidth / 4) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2)), self.size),
			"S": pg.Rect(((winWidth / 4) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2)), self.size),
			"Space": pg.Rect(((winWidth / 4) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2)), self.size),
			"UP": pg.Rect(((winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2)), self.size),
			"DOWN": pg.Rect(((winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2)), self.size),
			"LEFT": pg.Rect(((winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2)), self.size)
		}

	def draw(self, win):
		for key, rect in self.player_input.items():
			pg.draw.rect(win, (255, 255, 255), rect, 2, int(self.size[1] * 0.25))
			button = self.font.render(key, True, (255, 255, 255))
			win.blit(button, (rect.centerx - (button.get_size()[0] / 2), (rect.centery) - (button.get_size()[1] * 0.45)))
		timer = self.font.render(str(self.timer), True, (255, 255, 255))
		win.blit(timer, ((winWidth / 2) - (timer.get_size()[0] / 2), (winHeight / 2) - (timer.get_size()[1] / 2)))
  
	def update(self):
		tmp = time.time()
		delta = tmp - self.time
		if delta >= 1:
			self.time = tmp
			self.timer -= 1
