from .config import *
from .Button import *

class Pause:
	def __init__(self):
		self.freeze = False
		self.title_font = pg.font.Font(font, int(winHeight / 3))
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.buttons = [Button("RESUME", (winWidth / 2) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
                  Button("BACK TO MENU", (winWidth / 2) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]
  
	def draw(self, win):
		title = self.title_font.render("PAUSE", True, (255, 255, 255))
		win.blit(title, ((winWidth / 2) - (title.get_size()[0] / 2), -50))
  
		for button in self.buttons:
			button.draw(win)
  

	def click(self, core, mousePos):
		for button in self.buttons:
			if button.hitbox.collidepoint(mousePos):
				if button.name == "BACK TO MENU":
					core.state = "menu"
					core.mode = "none"
				core.pause[0] = False
				self.freeze = False
     