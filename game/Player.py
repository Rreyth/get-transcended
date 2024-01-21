import game.config as conf

class Player:
	size = [conf.winWidth * 0.007 ,conf.winHeight * 0.1]
	playerSpeed = conf.speed
	def __init__(self, nb):
		self.nb = nb
		if (nb == 1):
			self.pos = [conf.winWidth * 0.02, (conf.winHeight / 2) - (self.size[1] / 2)]
		else:
			self.pos = [conf.winWidth - (conf.winWidth * 0.02) - self.size[0], (conf.winHeight / 2) - (self.size[1] / 2)]
		self.paddle = conf.pg.Rect(self.pos, self.size)
	
	def	moveUp(self, wall):
		self.paddle.y -= self.playerSpeed
		while (self.paddle.colliderect(wall)):
			self.paddle.y += 1
			
	def moveDown(self, wall):
		self.paddle.y += self.playerSpeed
		while (self.paddle.colliderect(wall)):
			self.paddle.y -= 1

	def draw(self, win):
		conf.pg.draw.rect(win, (255, 255, 255), self.paddle)
  
	def update(self):
		# new_size = [conf.winWidth * 0.007 ,conf.winHeight * 0.1]
		# if (new_size[0] < 5):
		# 	new_size[0] = self.size[0]
		# if (new_size[1] < 30):
		# 	new_size[1] = self.size[1]
		# new_center = 
		# self.paddle.update((self.paddle.x, self.paddle.y), new_size)
		# self.size = new_size
		
		self.playerSpeed = conf.speed


#update speed ??