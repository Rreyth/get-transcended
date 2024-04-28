from .config import *

class Button:
	def __init__(self, name, x, y, width, height, text_size):
		self.name = name
		self.x = x
		self.y = y
		self.width = width
		self.height = height
		self.font = pg.font.Font(font, int(text_size))
		self.hitbox = pg.Rect((x, y), (width, height))
		self.highlight = False
		
		
	def draw(self, win):
		if self.highlight:
			pg.draw.rect(win, (130, 130, 130), self.hitbox, 0, int(self.height * 0.25))
		pg.draw.rect(win, (255, 255, 255), self.hitbox, 2, int(self.height * 0.25))
		button = self.font.render(self.name, True, (255, 255, 255))
		win.blit(button, (self.hitbox.centerx - (button.get_size()[0] / 2), (self.hitbox.centery) - (button.get_size()[1] * 0.45)))