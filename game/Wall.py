import game.config as conf

class Wall:
	def __init__(self, pos):
		self.size = [conf.winWidth ,5]
		self.pos = pos

		if pos == "up":
			self.coord = [0, conf.wallDist - (self.size[1] / 2)]
			self.hitbox = conf.pg.Rect((self.coord[0], self.coord[1] + self.size[1]), (self.size[0],  int(self.size[1] / 2)))
		else:
			self.coord = [0, conf.winHeight - conf.wallDist - (self.size[1] / 2)]
			self.hitbox = conf.pg.Rect((self.coord[0], self.coord[1] - int(self.size[1] / 2)), (self.size[0],  int(self.size[1] / 2)))

		self.wall = conf.pg.Rect(self.coord, self.size)
  
	def draw(self, win):
		conf.pg.draw.rect(win, (255, 255, 255), self.wall)
  
	def	update(self):
		self.size = [conf.winWidth ,5]
		hitbox_size = [self.size[0],  int(self.size[1] / 2)]
		if self.pos == "up":
			self.coord = [0, conf.wallDist - (self.size[1] / 2)]
			hitbox_coord = [self.coord[0], self.coord[1] + self.size[1]]
		else:
			self.coord = [0, conf.winHeight - conf.wallDist - (self.size[1] / 2)]
			hitbox_coord = [self.coord[0], self.coord[1] - int(self.size[1] / 2)]

		self.wall.update(self.coord, self.size)
		self.hitbox.update(hitbox_coord, hitbox_size)
