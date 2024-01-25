import time
import sys
from .input_handler import *
from .config import *
from .Player import *
from .Wall import *
from .Ball import *
from .update import *
from .render import *
from .Menu import *
from .Pause import *

class Game:
	def __init__(self): #init class
		pg.init()
		self.winSize = [winWidth, winHeight]
		self.win = pg.display.set_mode(self.winSize)
		self.clock = pg.time.Clock()
		self.fps = 120
		self.last = time.time()
		self.state = "menu"
		self.menu = Menu()
		self.pause = [False, Pause()]
		self.font = pg.font.Font(font, int(textSize))

	
	def run(self): #run game loop # relaunch when modif state
		while self.state != "end": # while self.state == "pause" # ajouter comme menu
			self.input()
			self.tick()
			self.render()
			self.clock.tick(self.fps)

		if self.state == "end": #update with win/loose/end loop
			print("Final score:", self.players[0].score, "-", self.players[1].score)
			self.quit()
			
	def input(self): #catch user input
		for event in pg.event.get():
			if event.type == pg.QUIT: #event click on cross
				self.quit()
			if event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE:
				escape_handler(self)
    
		self.keyboardState = pg.key.get_pressed()
		self.mouseState = pg.mouse.get_pressed()
		self.mousePos = pg.mouse.get_pos()
  
		input_handler(self)
		
	def tick(self): #calcul method
		tmp = time.time()
		delta = tmp - self.last
		self.last = tmp

		update_all(self, delta)
  
		pg.display.set_caption(str(self.clock.get_fps()))
		
	def render(self): #graphic update
		#render menu  #clean
		#render game(mode) #clean
		#render pause #over with transparancy
		#render end #clean?
		if self.state == "menu":
			render_menu(self)
		elif self.pause[0]:
			render_pause(self)
		elif self.state == "game":
			render_game(self)

		pg.display.update() #call to update render
		
	def quit(self):
		pg.quit()
		sys.exit()

Game().run()