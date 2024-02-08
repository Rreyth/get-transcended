from .config import *

class Wall:
	def __init__(self, pos):
		self.size = [winWidth ,5]
		self.pos = pos
		# self.triangle = False

		if pos == "up":
			self.coord = [0, wallDist - (self.size[1] / 2)]
			self.hitbox = pg.Rect((self.coord[0], self.coord[1] + self.size[1]), (self.size[0],  int(self.size[1] / 2)))
			self.wall = pg.Rect(self.coord, self.size)
		elif pos == "down":
			self.coord = [0, winHeight - wallDist - (self.size[1] / 2)]
			self.hitbox = pg.Rect((self.coord[0], self.coord[1] - int(self.size[1] / 2)), (self.size[0],  int(self.size[1] / 2)))
			self.wall = pg.Rect(self.coord, self.size)
		# elif pos == "tri_left":
		# 	self.triangle = True
		# 	rad = math.radians(120)
		# 	size = winHeight * 0.9
		# 	self.wall = [[(winWidth / 2) - (5 * math.sin(rad)), (winHeight * 0.1) + (5 * math.cos(rad))],
        #         [winWidth / 2, winHeight * 0.1],
        #         [(winWidth / 2) + (size * math.cos(rad)), (winHeight * 0.1) + (size * math.sin(rad))],
        #         [((winWidth / 2) - (5 * math.sin(rad))) + (size * math.cos(rad)), ((winHeight * 0.1) + (5 * math.cos(rad))) + (size * math.sin(rad))]]
		# elif pos == "tri_right":
		# 	self.triangle = True
		# 	rad = math.radians(60)
		# 	size = winHeight * 0.9
		# 	self.wall = [[winWidth / 2, winHeight * 0.1],
        #         [(winWidth / 2) + (5 * math.sin(rad)), (winHeight * 0.1) - (5 * math.cos(rad))],
        #         [((winWidth / 2) + (5 * math.sin(rad))) + (size * math.cos(rad)), (winHeight * 0.1) + (size * math.sin(rad))],
        #         [(winWidth / 2) + (size * math.cos(rad)), (winHeight * 0.1) + (size * math.sin(rad))]]
		# elif pos == "tri_down":
		# 	self.triangle = True
		# 	# rad = math.radians(120)
		# 	# size = winHeight * 0,75
		# 	# self.wall = [[(winWidth / 2) - (5 * math.sin(rad)), (winHeight / 5) + (5 * math.cos(rad))],
        #     #     [winWidth / 2, winHeight / 5],
        #     #     [(winWidth / 2) + (size * math.cos(rad)), (winHeight / 5) + (size * math.sin(rad))],
        #     #     [((winWidth / 2) - (5 * math.sin(rad))) + (size * math.cos(rad)), ((winHeight / 5) + (5 * math.cos(rad))) + (size * math.sin(rad))]]

  
	def draw(self, win):
		# if not self.triangle:
		pg.draw.rect(win, (255, 255, 255), self.wall)
		# else:
		# 	pg.draw.polygon(win, (255, 255, 255), self.wall)
		# 	# win.blit(self.hitbox, self.hitbox_pos)
  
	# def collide(self, object, type):
	# 	if not self.triangle:
	# 		return(self.hitbox.colliderect(object))
