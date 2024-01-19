from .config import *

class Player:
	def __init__(self):
		self.size = ((winWidth * 0.007 ,winHeight * 0.1))
		self.pos = ((winWidth * 0.02, (winHeight / 2) - (self.size[1] / 2)))
		self.speed = speed
		self.paddle = pg.Rect(self.pos, self.size)
	
	def	moveUp(self, wall):
		# tmp = self.paddle.y
		self.paddle.y -= self.speed
		while (self.paddle.colliderect(wall)):
			self.paddle.y += 1
			
	def moveDown(self, wall):
		# tmp = self.paddle.y
		self.paddle.y += self.speed
		while (self.paddle.colliderect(wall)):
			self.paddle.y -= 1

	def draw(self, win):
		pg.draw.rect(win, (255, 255, 255), self.paddle)

#update rect 
# pygame.Rect.fit
# resize and move a rectangle with aspect ratio

#update speed ??