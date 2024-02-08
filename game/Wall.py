from .config import *

class Wall:
	def __init__(self, pos, square):
		self.size = [winWidth ,5]
		self.pos = pos
		# self.triangle = False

		if not square:
			if pos == "up":
				self.coord = [0, wallDist - (self.size[1] / 2)]
				self.hitbox = pg.Rect((self.coord[0], self.coord[1] + self.size[1]), (self.size[0],  int(self.size[1] / 2)))
			elif pos == "down":
				self.coord = [0, winHeight - wallDist - (self.size[1] / 2)]
				self.hitbox = pg.Rect((self.coord[0], self.coord[1] - int(self.size[1] / 2)), (self.size[0],  int(self.size[1] / 2)))
		else:
			if pos == "up":
				self.coord = [0, 0]
			elif pos == "down":
				self.coord = [0, winHeight - self.size[1]]
			elif pos == "left":
				self.size.reverse()
				self.coord = [0, 0]
			elif pos == "right":
				self.size.reverse()
				self.coord = [winWidth - self.size[0], 0]
			self.hitbox = pg.Rect(self.coord, self.size)
		self.wall = pg.Rect(self.coord, self.size)

  
	def draw(self, win):
		pg.draw.rect(win, (255, 255, 255), self.wall)

  
	# def collide(self, object, type):
	# 	if not self.triangle:
	# 		return(self.hitbox.colliderect(object))
