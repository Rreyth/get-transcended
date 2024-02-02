from .config import *
from .Player import *
from .Wall import *
from .Ball import *
from .StartScreen import *
from .Pause import *
from .AI import *

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
   
   
	def click(self, core, mousePos):
		for key, rect in self.buttons.items():
			if rect.collidepoint(mousePos):
				if key != "CUSTOM":
					setValues(key, core)
				else:
					pass
					# customMenu(core)

	
 
def setValues(key, core):
	if key == "LOCAL":
		core.max_score = 5
		core.players = [Player(1, "Player1"), Player(2, "Player2")]
		core.walls = [Wall("up"), Wall("down")]
		core.ball = Ball()
		core.state = "start"
		core.mode = "local"
	if key == "SOLO":
		core.max_score = 5
		core.players = [Player(1, "Player1"), Player(2, "AI")]
		core.ai = AI(core.players[1])
		core.walls = [Wall("up"), Wall("down")]
		core.ball = Ball()
		core.state = "start"
		core.mode = "solo"
	if key == "ONLINE":
		pass
	if core.mode != "none":
		core.start_screen = StartScreen(core.mode)
