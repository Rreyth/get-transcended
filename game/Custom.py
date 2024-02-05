from .config import *

class CustomMenu: #modif max score (fleches?)/ time ? nb players ? / mode selected pour highlight le mode selectionne
	def __init__(self):
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.font = pg.font.Font(font, int(winHeight * 0.085))
		self.buttons = {
			"BACK TO MENU": pg.Rect((25, winHeight - self.size[1] - 25), self.size),
			"START": pg.Rect((winWidth - self.size[0] - 25, winHeight - self.size[1] - 25), self.size)#,
			# "Space": pg.Rect(((winWidth / 4) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2)), self.size), #1v1 borderless
			# "UP": pg.Rect(((winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2)), self.size), #aivai
			# "DOWN": pg.Rect(((winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2)), self.size), #triangle
			# "LEFT": pg.Rect(((winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2)), self.size)
		}
	
	def draw(self, win):
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