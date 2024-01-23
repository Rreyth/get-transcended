import time
import sys
from .input_handler import *
from .config import *
from .Player import *
from .Wall import *
from .Ball import *
from .update import *

class Game:
	def __init__(self): #init class
		pg.init()
		self.winSize = [winWidth, winHeight]
		self.win = pg.display.set_mode(self.winSize)
		self.clock = pg.time.Clock()
		self.fps = 120
		self.last = time.time()
		self.state = "game"
		self.players = [Player(1, "Player1"), Player(2, "Player2")]
		self.walls = [Wall("up"), Wall("down")]
		self.ball = Ball()
		self.font = pg.font.Font(font, int(textSize))
	
	def run(self): #run game loop # relaunch when modif state
		# while self.state == "menu"
		# while self.state == "pause"
		while self.state == "game":
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
  
		score = str(self.players[0].score) + " - " + str(self.players[1].score)
  
		names = [self.players[0].name, self.players[1].name]
  
		text = [self.font.render(score, True, (255, 255, 255)), self.font.render(names[0], True, (255, 255, 255)), self.font.render(names[1], True, (255, 255, 255))]

		self.win.blit(text[0], ((winWidth / 2) - (text[0].get_size()[0] / 2), textDist))
		self.win.blit(text[1], (0, textDist))
		self.win.blit(text[2], (winWidth - text[2].get_size()[0], textDist))

		pg.display.update() #call to update render
		
	def quit(self):
		pg.quit()
		sys.exit()

Game().run()