from .config import *

class Player:
	speed = speed_per_sec * 0.005
	def __init__(self, nb, name):
		self.nb = nb
		self.name = name
		self.win = "LOOSE"
		self.score = 0
		size = [winWidth * 0.007 ,winHeight * 0.1]
		if (nb == 1):
			pos = [winWidth * 0.02, (winHeight / 2) - (size[1] / 2)]
			self.goal = pg.Rect((-50, 0), (50, winHeight))
		else:
			pos = [winWidth - (winWidth * 0.02) - size[0], (winHeight / 2) - (size[1] / 2)]
			self.goal = pg.Rect((winWidth, 0), (50, winHeight))
		self.paddle = pg.Rect(pos, size)
	
	def	moveUp(self, walls):
		self.paddle.y -= self.speed
		while walls and self.paddle.colliderect(walls[0].hitbox):
			self.paddle.y += 1
			
	def moveDown(self, walls):
		self.paddle.y += self.speed
		while walls and self.paddle.colliderect(walls[1].hitbox):
			self.paddle.y -= 1

	def draw(self, win):
		pg.draw.rect(win, (255, 255, 255), self.paddle)
