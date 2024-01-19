import math
import time
import sys
from .input_handler import input_handler
from .config import *
from .player import Player

class Game:
	def __init__(self): #init class
		pg.init()
		self.winSize = ((winWidth, winHeight))
		self.win = pg.display.set_mode(self.winSize, pg.RESIZABLE)
		self.clock = pg.time.Clock()
		self.fps = 120
		self.last = time.time()
		self.runMainLoop = True
		self.player = Player()
	
	def run(self): #run game loop
		while self.runMainLoop:
			self.input()
			self.tick()
			self.render()
			self.clock.tick(self.fps)
			
	def input(self): #catch user input
		for event in pg.event.get():
			if event.type == pg.QUIT: #event click on cross
				self.quit()
				
		self.keyboardState = pg.key.get_pressed()
		self.mouseState = pg.mouse.get_pressed()
		self.mousePos = pg.mouse.get_pos()
		
		# interpret input
		input_handler(self, self.player, pg)

	def tick(self): #calcul method
		tmp = time.time()
		delta = tmp - self.last
		self.last = tmp
		
		pg.display.set_caption(str(self.clock.get_fps()))
		
	def render(self): #graphic update
		self.win.fill((0, 0, 0)) #clean screen
		
		#update drawing
		self.player.draw(self.win)
  
		pg.display.update() #call to update render
		
	def quit(self):
		pg.quit()
		sys.exit()

Game().run()