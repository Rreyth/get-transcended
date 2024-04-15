from .config import *
from .Player import *
from .Wall import *
from .Ball import *
from .StartScreen import *
from .WaitScreen import *
from .Pause import *
from .AI import *
from .Custom import *
from .Button import *

class Menu:
	def __init__(self):
		self.title_font = pg.font.Font(font, int(winHeight / 3))
		self.text_font = pg.font.Font(font, int(winHeight * 0.05))
		self.button_size = [winWidth * 0.1, winHeight * 0.1]
		self.buttons = [Button("SOLO", (winWidth / 3) - (self.button_size[0] / 2), (winHeight / 2) - self.button_size[1], self.button_size[0], self.button_size[1], winHeight * 0.085),
				  Button("LOCAL", (winWidth / 3 * 2) - (self.button_size[0] / 2), (winHeight / 2) - self.button_size[1], self.button_size[0], self.button_size[1], winHeight * 0.085),
				  Button("ONLINE", (winWidth / 3) - (self.button_size[0] / 2), (winHeight / 3 * 2), self.button_size[0], self.button_size[1], winHeight * 0.085),
				  Button("CUSTOM", (winWidth / 3 * 2) - (self.button_size[0] / 2), (winHeight / 3 * 2), self.button_size[0], self.button_size[1], winHeight * 0.085),
				  Button("JOIN", 25, winHeight - self.button_size[1] - 25, self.button_size[0], self.button_size[1], winHeight * 0.085),
				  Button("", self.button_size[0] + 35, winHeight - self.button_size[1] - 25, self.button_size[0], self.button_size[1], winHeight * 0.085)]
		self.err = False
  
	def draw(self, win):
		title = self.title_font.render("PONG", True, (255, 255, 255))
		win.blit(title, ((winWidth / 2) - (title.get_size()[0] / 2), -50))
		if self.err:
			text = self.text_font.render(self.err, True, (255, 102, 102))
			win.blit(text, (self.buttons[5].x + self.button_size[0] + 15, self.buttons[5].y + (self.button_size[1] * 0.2)))
  
		for button in self.buttons:
			button.draw(win)
   
   
	async def click(self, core, mousePos):
		for button in self.buttons:
			if button.hitbox.collidepoint(mousePos):
				await self.setValues(button.name, core)
	
 
	async def setValues(self, name, core):
		core.custom_mod = False
		core.obstacle = False
		if name == 'JOIN':
			if self.buttons[5].name.__len__() == 0:
				self.err = "Room id is empty"
				return
			await core.GameHub.send(json.dumps({'type' : 'join', 'id' : self.buttons[5].name}))
			response : dict = json.loads(await core.GameHub.recv())
			if response['success'] == 'false':
				self.err = "Room " + self.buttons[5].name + " doesn't exist"
			else:
				core.GameSocket = response['socket']
				room_id = self.buttons[5].name
				core.id = response['pos']
				core.state = "waiting"
				core.mode = "ONLINE"
				core.online = True
				wait_nb = response['max']
				core.custom_mod = "1V1V1V1" if "1V1V1V1" in response['custom_mods'] else False
				core.start_screen = StartScreen(response['mode'], core.online, True if "1V1V1V1" in response['custom_mods'] else False, wait_nb)

		if name == self.buttons[5].name:
			self.buttons[5].highlight = not self.buttons[5].highlight

		if name == "LOCAL":
			msg = {"type" : "quickGame", "cmd" : "join", "online" : "false"}
			await core.GameHub.send(json.dumps(msg))
	
			core.players = [Player(1, core.alias + "1", 2, False, False), Player(2, core.alias + "2", 2, False, False)]
			core.walls = [Wall("up", False), Wall("down", False)]
			core.ball = Ball(False)
			core.state = "start"
			core.mode = "LOCAL"
	
		if name == "SOLO":
			msg = {"type" : "quickGame", "cmd" : "join", "online" : "false"}
			await core.GameHub.send(json.dumps(msg))
	
			core.players = [Player(1, core.alias, 2, False, False), Player(2, "AI", 2, False, False)]
			core.ai.append(AI(core.players[1]))
			core.walls = [Wall("up", False), Wall("down", False)]
			core.ball = Ball(False)
			core.state = "start"
			core.mode = "solo"
	
		if name == "CUSTOM":
			core.state = "custom"
			core.custom_menu = CustomMenu()
		
		if name == "ONLINE":
			msg = {"type" : "quickGame", "cmd" : "join", "online" : "true"}
			await core.GameHub.send(json.dumps(msg))
			response : dict = json.loads(await core.GameHub.recv())
			if 'socket' in response.keys():
				core.GameSocket = response['socket']
				room_id = response['ID']
				core.state = "waiting"
				core.mode = "ONLINE"
				core.id = response['pos']	
			core.online = True
			wait_nb = 2

		if core.mode != "none":
			self.buttons[5].name = ""
			self.err = False
			if not core.start_screen:
				core.start_screen = StartScreen(core.mode, core.online)
			if core.online and not core.wait_screen:
				core.wait_screen = WaitScreen(room_id, core.id, wait_nb, "QuickGame Online")
