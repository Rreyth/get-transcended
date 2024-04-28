from .config import *
from .input_handler import *
from .Player import *
from .Wall import *
from .Ball import *
from .update import *
from .render import *
from .Menu import *
from .Pause import *
from .End import *
from .StartScreen import *

class Game:
	def __init__(self):
		pg.init()
		self.state = "menu"
		self.mode = "none"
		self.menu = Menu()
		self.pause = [False, Pause()]
		self.end = End()
		self.font = pg.font.Font(font, int(textSize))
		self.players = False
		self.win = False
		self.alias = 'ALIAS'
		self.is_running = False

	def start(self, websocket):
		self.max_score = 10
		self.ai = []
		self.pressed = []
		self.online = False
		self.is_running = True
		self.id = 1
		self.GameRoom = False
		self.GameHub = websocket
		self.winSize = [winWidth, winHeight]
		if not self.win:
			self.win = pg.display.set_mode(self.winSize)
		pg.display.set_caption("PONG")
		self.last = time.time()
		self.wait_screen = False
		self.start_screen = False
			
	def endMsg(self, reason = 'end'):
		msg = {'type' : 'endGame'}
		if self.players:
			msg['score'] = [player.score for player in self.players]
			msg['win'] = [player.win for player in self.players]
		msg['reason'] = reason
		return msg
   
	async def input(self):
		for event in pg.event.get():
			if event.type == pg.QUIT:
				await self.quit()
			if event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE:
				await escape_handler(self)
			if event.type == pg.KEYDOWN and self.menu.buttons[5].highlight and self.state == "menu":
				await input_id(self, self.menu.buttons[5], event.key, event.unicode)
			if event.type == pg.MOUSEBUTTONDOWN:
				self.mouseState = pg.mouse.get_pressed()
				self.mousePos = pg.mouse.get_pos()
				await mouse_handler(self)

		if not self.is_running:
			return

		self.keyboardState = pg.key.get_pressed()

		input_handler(self)
		
	async def tick(self):
		tmp = time.time()
		delta = tmp - self.last
		self.last = tmp

		if self.online:
			await self.sendInputs()

		await update_all(self, delta)

	async def sendInputs(self):
		if self.pressed.__len__() == 0:
			return

		msg = {'type' : 'input',
				'player' : self.id,
           		'inputs' : self.pressed}
  
		await self.GameRoom.send(json.dumps(msg))
		self.pressed = []

		
	def render(self):

		if self.state == "waiting":
			render_wait(self)
		if self.state == "start":
			render_start(self)
		elif self.state == "end":
			render_end(self)
		elif self.state == "menu":
			render_menu(self)
		elif self.state == "custom":
			render_custom(self)
		elif self.pause[0]:
			render_pause(self)
		elif self.state == "game":
			render_game(self)

		pg.display.update()
		
	async def quit(self):
		if self.is_running:
			if not self.online:
				await self.GameHub.send(json.dumps(self.endMsg('quit')))
			else:
				if self.state == 'waiting':
					await self.GameHub.send(json.dumps({'type' : 'quitGame', 'id' : self.id}))
				else:
					await self.GameRoom.send(json.dumps({'type' : 'quitGame', 'id' : self.id}))
		self.state = "quit"
		self.is_running = False
	
	def pygame_quit(self):
		pg.quit()
