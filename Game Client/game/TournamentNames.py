from .Button import *
from .Arrow import *
from .Vec2 import *
from .config import *
import string

class TournamentNames:
	def __init__(self, players):
		self.size = [winWidth * 0.15, winHeight * 0.1]
		self.gap = [winWidth * 0.175, winHeight * 0.15]
		self.init = [winWidth * 0.25 - self.size[0], winHeight * 0.25 - self.size[1]]
		self.pos = [self.init[0], self.init[1]]
  
		self.names = []
		j = 0
		i = 0
		for player in players:
			if player.name == "AI":
				continue
			self.names.append(Button(player.name, self.init[0] + (self.gap[0] * i), self.init[1] + (self.gap[1] * j), self.size[0], self.size[1], winHeight * 0.085, True))
			i += 1
			if i == 4:
				j += 1
				i = 0

		self.start_button = Button("START", winWidth * 0.83, winHeight * 0.86, self.size[0], self.size[1], winHeight * 0.085)
		self.arrows = False
		if self.names.__len__() > 20:
			self.arrows = [Arrow("", winWidth * 0.01, winHeight * 0.02, winWidth * 0.05, winHeight * 0.05, winHeight * 0.085, "up"),
                  			Arrow("", winWidth * 0.01, winHeight * 0.93, winWidth * 0.05, winHeight * 0.05, winHeight * 0.085, "down")]
   
	def draw(self, win):
		for button in self.names:
			button.draw(win)
		self.start_button.draw(win)
		if self.arrows:
			for arrow in self.arrows:
				arrow.draw(win)
    
	async def click(self, core, mousePos):
		for button in self.names:
			if button.hitbox.collidepoint(mousePos):
				if not button.highlight:
					for b in self.names:
						b.highlight = False
					button.highlight = True
				else:
					button.highlight = False
				return

		if self.arrows:
			for arrow in self.arrows:
				if arrow.hitbox.collidepoint(mousePos):
					self.scroll(arrow.dir)
					return
 
		if self.start_button.hitbox.collidepoint(mousePos):
			for i in range(self.names.__len__()):
				core.players[i].name = self.names[i].name
			core.state = "tournament"
			await core.tournament.initPlayers(core.players)
   
	def scroll(self, dir):
		if self.names.__len__() <= 20:
			return

		if self.names.__len__() % 4 == 0:
			last_pos = self.pos[1] + (self.gap[1] * ((self.names.__len__() / 4) - 1))
		else:
			last_pos = self.pos[1] + (self.gap[1] * (self.names.__len__() / 4))
		if dir == 'up' and self.pos[1] < self.init[1]:
			self.pos[1] += winHeight * 0.075
		elif dir == 'down' and last_pos > (winHeight * 0.8):
			self.pos[1] -= winHeight * 0.075
   
		i = 0
		j = 0
		for button in self.names:
			button.x = self.pos[0] + (self.gap[0] * i)
			button.y = self.pos[1] + (self.gap[1] * j)
			button.hitbox.pos = Vec2(button.x, button.y)
			i += 1
			if i == 4:
				j += 1
				i = 0
    
	def input(self, key, code):
		set = string.ascii_letters + string.digits
		for button in self.names:
			if not button.highlight:
				continue
			if code in set and button.name.__len__() < 9:
				button.name += code
			elif key == pg.K_BACKSPACE:
				button.name = button.name[:-1]
			elif key == pg.K_RETURN or key == pg.K_KP_ENTER:
				button.highlight = False
			break
