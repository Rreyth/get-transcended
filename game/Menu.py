from .config import *
from .Player import *
from .Wall import *
from .Ball import *
from .StartScreen import *
from .Pause import *
from .AI import *
from .Custom import *
from .Button import *

class Menu:
	def __init__(self):
		self.title_font = pg.font.Font(font, int(winHeight / 3))
		self.button_size = [winWidth * 0.1, winHeight * 0.1]
		self.buttons = [Button("SOLO", (winWidth / 3) - (self.button_size[0] / 2), (winHeight / 2) - self.button_size[1], self.button_size[0], self.button_size[1], winHeight * 0.085),
                  Button("LOCAL", (winWidth / 3 * 2) - (self.button_size[0] / 2), (winHeight / 2) - self.button_size[1], self.button_size[0], self.button_size[1], winHeight * 0.085),
                  Button("ONLINE", (winWidth / 3) - (self.button_size[0] / 2), (winHeight / 3 * 2), self.button_size[0], self.button_size[1], winHeight * 0.085),
                  Button("CUSTOM", (winWidth / 3 * 2) - (self.button_size[0] / 2), (winHeight / 3 * 2), self.button_size[0], self.button_size[1], winHeight * 0.085)]

  
	def draw(self, win):
		title = self.title_font.render("PONG", True, (255, 255, 255))
		win.blit(title, ((winWidth / 2) - (title.get_size()[0] / 2), -50))
  
		for button in self.buttons:
			button.draw(win)
   
   
	def click(self, core, mousePos):
		for button in self.buttons:
			if button.hitbox.collidepoint(mousePos):
				setValues(button.name, core)
	
 
def setValues(name, core):
	core.custom_mod = False
	core.obstacle = False
	if name == "LOCAL":
		core.max_score = 5
		core.players = [Player(1, "Player1", 2, False, False), Player(2, "Player2", 2, False, False)]
		core.walls = [Wall("up", False), Wall("down", False)]
		core.ball = Ball(False)
		core.state = "start"
		core.mode = "LOCAL"
	if name == "SOLO":
		core.max_score = 5
		core.players = [Player(1, "Player1", 2, False, False), Player(2, "AI", 2, False, False)]
		core.ai.append(AI(core.players[1]))
		core.walls = [Wall("up", False), Wall("down", False)]
		core.ball = Ball(False)
		core.state = "start"
		core.mode = "solo"
	if name == "CUSTOM":
		core.state = "custom"
		core.custom_menu = CustomMenu()
	if name == "ONLINE":
		pass
	if core.mode != "none":
		core.start_screen = StartScreen(core.mode)
