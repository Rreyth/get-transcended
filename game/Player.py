from .config import *

class Player:
	speed = speed_per_sec * 0.005
	def __init__(self, nb, name, nb_total, borderless):
		self.borderless = borderless
		self.nb = nb
		self.name = name
		self.win = "LOOSE"
		self.score = 0
		self.initPaddle(nb_total, borderless)
		
  
	def initPaddle(self, nb_total, borderless):
		size = [winWidth * 0.007 ,winHeight * 0.1]
		if nb_total == 2 or nb_total == 3: #pour l'instant gere aussi le 1v1v1 jusqu'a l'implementation du triangle
			if (self.nb == 1):
				pos = [winWidth * 0.02, (winHeight / 2) - (size[1] / 2)]
				self.goal = pg.Rect((-50, 0), (50, winHeight))
				self.side = "left"
			else:
				pos = [winWidth - (winWidth * 0.02) - size[0], (winHeight / 2) - (size[1] / 2)]
				self.goal = pg.Rect((winWidth, 0), (50, winHeight))
				self.side = "right"

		#elif nb_total == 3:
		#triangle

		elif nb_total == 4:
			if (self.nb == 1):
				pos = [winWidth * 0.02, (winHeight / 2) - size[1]]
				self.goal = pg.Rect((-50, 0), (50, winHeight))
				self.side = "left"
			elif (self.nb == 2):
				pos = [winWidth * 0.02 + 50, (winHeight / 2)]
				self.goal = pg.Rect((-50, 0), (50, winHeight))
				self.side = "left"
			elif (self.nb == 3):
				pos = [winWidth - (winWidth * 0.02) - size[0], (winHeight / 2) - size[1]]
				self.goal = pg.Rect((winWidth, 0), (50, winHeight))
				self.side = "right"
			else:
				pos = [winWidth - (winWidth * 0.02) - size[0] - 50, (winHeight / 2)]
				self.goal = pg.Rect((winWidth, 0), (50, winHeight))
				self.side = "right"
     
		self.paddle = [pg.Rect(pos, size)]
		if borderless:
			self.paddle.append(pg.Rect((pos[0], pos[1] - winHeight), size))
			self.paddle.append(pg.Rect((pos[0], pos[1] + winHeight), size))
 
	def	moveUp(self, walls):
		self.paddle[0].y -= self.speed
		while walls and self.paddle[0].colliderect(walls[0].hitbox):
			self.paddle[0].y += 1
		if self.borderless:
			if self.paddle[0].centery < 0:
				self.paddle[0].centery += winHeight
			self.paddle[1].centery = self.paddle[0].centery - winHeight
			self.paddle[2].centery = self.paddle[0].centery + winHeight
			
	def moveDown(self, walls):
		self.paddle[0].y += self.speed
		while walls and self.paddle[0].colliderect(walls[1].hitbox):
			self.paddle[0].y -= 1
		if self.borderless:
			if self.paddle[0].centery >= winHeight:
				self.paddle[0].centery -= winHeight
			self.paddle[1].centery = self.paddle[0].centery - winHeight
			self.paddle[2].centery = self.paddle[0].centery + winHeight

	def draw(self, win):
		for paddle in self.paddle:
			pg.draw.rect(win, (255, 255, 255), paddle)
