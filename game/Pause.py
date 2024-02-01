from .config import *

class Pause:
	def __init__(self):
		self.freeze = False
		self.title_font = pg.font.Font(font, int(winHeight / 3))
		self.font = pg.font.Font(font, int(winHeight * 0.085))
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.buttons = {}
		self.buttons["RESUME"] = pg.Rect(((winWidth / 2) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2)), self.size)
		self.buttons["BACK TO MENU"] = pg.Rect(((winWidth / 2) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2)), self.size)
  
	def draw(self, win):
		title = self.title_font.render("PAUSE", True, (255, 255, 255))
		win.blit(title, ((winWidth / 2) - (title.get_size()[0] / 2), -50))
  
		for key, rect in self.buttons.items():
			pg.draw.rect(win, (255, 255, 255), rect, 2, int(self.size[1] * 0.25))
			button = self.font.render(key, True, (255, 255, 255))
			win.blit(button, (rect.centerx - (button.get_size()[0] / 2), (rect.centery) - (button.get_size()[1] * 0.45)))
   
	def click(self, core, mousePos):
		for key, rect in self.buttons.items():
			if rect.collidepoint(mousePos):
				if key == "BACK TO MENU":
					core.state = "menu"
					core.mode = "none"
				core.pause[0] = False
				self.freeze = False