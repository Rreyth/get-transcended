import math
import time
import sys
import pygame as pg
from .input_handler import *
import game.config as conf
from .Player import *
from .Wall import *
from .Ball import *
from .update import *

class Game:
	def __init__(self): #init class
		pg.init()
		self.winSize = [conf.winWidth, conf.winHeight]
		self.win = pg.display.set_mode(self.winSize)
		self.clock = pg.time.Clock()
		self.fps = 120
		self.last = time.time()
		self.runMainLoop = True
		self.players = [Player(1), Player(2)]
		self.walls = [Wall("up"), Wall("down")]
		self.ball = Ball()
		self.font = pg.font.Font(conf.scoreFont, int(conf.textSize))
		self.text = self.font.render("3 - 5", True, (255, 255, 255))
	
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
  
		input_handler_2p(self, self.players)
		
	def tick(self): #calcul method
		tmp = time.time()
		delta = tmp - self.last
		self.last = tmp

		update_all(self, delta)
  
		pg.display.set_caption(str(self.clock.get_fps()))
		
	def render(self): #graphic update
		self.win.fill((0, 0, 0)) #clean screen
		
		#update drawing (render in another file ?)
		#fct draw avec des for 
		self.players[0].draw(self.win)
		self.players[1].draw(self.win)
		self.walls[0].draw(self.win)
		self.walls[1].draw(self.win)
		self.ball.draw(self.win)

		self.win.blit(self.text, ((conf.winWidth / 2) - (self.text.get_size()[0] / 2), conf.textDist))

		pg.display.update() #call to update render
		
	def quit(self):
		pg.quit()
		sys.exit()

Game().run()