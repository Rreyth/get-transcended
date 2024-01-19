from .config import *

class Wall:
	def __init__(self, pos):
		self.size = ((winWidth ,5))

		if pos == "up":
			self.pos = ((0, wallDist - (self.size[1] / 2)))
			self.hitbox = pg.Rect((self.pos[0], self.pos[1] + self.size[1]), (self.size[0],  int(self.size[1] / 2)))
		else:
			self.pos = ((0, winHeight - wallDist - (self.size[1] / 2)))
			self.hitbox = pg.Rect((self.pos[0], self.pos[1] - int(self.size[1] / 2)), (self.size[0],  int(self.size[1] / 2)))

		self.wall = pg.Rect(self.pos, self.size)
  
	def draw(self, win):
		pg.draw.rect(win, (255, 255, 255), self.wall)
