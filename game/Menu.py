from .config import *

class Menu:
	def __init__(self):
		self.title_font = pg.font.Font(font, int(winHeight / 3))
		self.button_font = pg.font.Font(font, int(winHeight * 0.085))
		self.button_size = [winWidth * 0.1, winHeight * 0.1]
		self.buttons = {}
		self.buttons["SOLO"] = pg.Rect(((winWidth / 3) - (self.button_size[0] / 2), (winHeight / 2) - self.button_size[1]), self.button_size)
		self.buttons["LOCAL"] = pg.Rect(((winWidth / 3 * 2) - (self.button_size[0] / 2), (winHeight / 2) - self.button_size[1]), self.button_size)
		self.buttons["ONLINE"] = pg.Rect(((winWidth / 3) - (self.button_size[0] / 2), (winHeight / 3 * 2)), self.button_size)
		self.buttons["CUSTOM"] = pg.Rect(((winWidth / 3 * 2) - (self.button_size[0] / 2), (winHeight / 3 * 2)), self.button_size)
  
	def draw(self, win):
		title = self.title_font.render("PONG", True, (255, 255, 255))
		win.blit(title, ((winWidth / 2) - (title.get_size()[0] / 2), -50))
  
		for key, rect in self.buttons.items():
			pg.draw.rect(win, (255, 255, 255), rect, 2, int(self.button_size[1] * 0.25))
			button = self.button_font.render(key, True, (255, 255, 255))
			win.blit(button, (rect.centerx - (button.get_size()[0] / 2), (rect.centery) - (button.get_size()[1] * 0.45)))
