from .config import *

class End:
	def __init__(self):
		self.button_font = pg.font.Font(font, int(winHeight * 0.085))
		self.text_font = pg.font.Font(font, int(winHeight * 0.1))
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.button = pg.Rect(((winWidth / 2) - (self.size[0] / 2), winHeight - (self.size[1] * 1.5)), self.size)
  
  
  
	def draw(self, core, win):
		text = self.text_font.render(core.players[0].name, True, (255, 255, 255))
		win.blit(text, ((winWidth / 3) - (text.get_size()[0] / 2), (winHeight / 3) - (text.get_size()[1] /2)))
		text = self.text_font.render(core.players[0].win, True, (255, 255, 255))
		win.blit(text, ((winWidth / 3) - (text.get_size()[0] / 2), (winHeight / 2) - (text.get_size()[1] /2)))
		text = self.text_font.render(str(core.players[0].score), True, (255, 255, 255))
		win.blit(text, ((winWidth / 2) - 75, (winHeight / 2) - (text.get_size()[1] /2)))
  
		text = self.text_font.render(core.players[1].name, True, (255, 255, 255))
		win.blit(text, ((winWidth / 3 * 2) - (text.get_size()[0] / 2), (winHeight / 3) - (text.get_size()[1] /2)))
		text = self.text_font.render(core.players[1].win, True, (255, 255, 255))
		win.blit(text, ((winWidth / 3 * 2) - (text.get_size()[0] / 2), (winHeight / 2) - (text.get_size()[1] /2)))
		text = self.text_font.render(str(core.players[1].score), True, (255, 255, 255))
		win.blit(text, ((winWidth / 2) + 50, (winHeight / 2) - (text.get_size()[1] / 2)))
  
		text = self.text_font.render("_", True, (255, 255, 255))
		win.blit(text, ((winWidth / 2) - (text.get_size()[0] / 2), (winHeight / 2) - (text.get_size()[1] * 0.75)))
  
		pg.draw.rect(win, (255, 255, 255), self.button, 2, int(self.size[1] * 0.25))
		button = self.button_font.render("BACK TO MENU", True, (255, 255, 255))
		win.blit(button, (self.button.centerx - (button.get_size()[0] / 2), (self.button.centery) - (button.get_size()[1] * 0.45)))
  
	def click(self, core, mousePos):
		if self.button.collidepoint(mousePos):
			core.state = "menu"
			core.pause[0] = False
			core.pause[1].freeze = False