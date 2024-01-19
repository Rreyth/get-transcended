from .config import *

class Player:
	def __init__(self):
		self.size = ((4 ,20))
		self.pos = ((50, (winHeight / 2) - (self.size[1] / 2)))
		self.speed = 5
		self.paddle = pg.Rect(self.pos, self.size)
	
	def	moveUp(self):
		if (self.paddle.y - self.speed >= 0): #update avec collide rect pour les walls
			self.paddle.y -= self.speed
		
	def moveDown(self):
		if (self.paddle.y + self.speed <= winHeight): #update avec collide rect pour les walls
			self.paddle.y += self.speed

	def draw(self, win):
		pg.draw.rect(win, (255, 0, 0), self.paddle)
