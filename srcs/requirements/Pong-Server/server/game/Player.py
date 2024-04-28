from config import *
from Vec2 import *
from Hitbox import *

class Player:
	def __init__(self, nb, name, nb_total, borderless, square):
		self.borderless = borderless
		self.nb_total = nb_total
		self.square = square
		self.speed_per_sec = speed_per_sec
		self.speed = self.speed_per_sec * 0.005
		self.nb = nb
		self.name = name
		self.win = "LOSE"
		self.score = 0
		self.initPaddle(nb_total, borderless, square)
		
  
	def initPaddle(self, nb_total, borderless, square):
		self.size = [winWidth * 0.007 ,winHeight * 0.1]
		if nb_total == 2:
			if (self.nb == 1):
				pos = [winWidth * 0.02, (winHeight / 2) - (self.size[1] / 2)]
				self.goal = Hitbox(-50, 0, 50, winHeight)
				self.side = "left"
			else:
				pos = [winWidth - (winWidth * 0.02) - self.size[0], (winHeight / 2) - (self.size[1] / 2)]
				self.goal = Hitbox(winWidth, 0, 50, winHeight)
				self.side = "right"

		elif square:
			if (self.nb == 1):
				pos = [winWidth * 0.02, (winHeight / 2) - (self.size[1] / 2)]
				self.goal = Hitbox(-43, 0, 50, winHeight)
				self.side = "left"
			elif (self.nb == 2):
				pos = [winWidth - (winWidth * 0.02) - self.size[0], (winHeight / 2) - (self.size[1] / 2)]
				self.goal = Hitbox(winWidth - 7, 0, 50, winHeight)
				self.side = "right"
			elif (self.nb == 3):
				self.size.reverse()
				self.size[0] = winWidth * 0.1
				self.speed_per_sec = winWidth
				pos = [(winWidth / 2) - (self.size[0] / 2), (winWidth * 0.02)]
				self.goal = Hitbox(0, -43, winWidth, 50)
				self.side = "up"
			else:
				self.size.reverse()
				self.size[0] = winWidth * 0.1
				self.speed_per_sec = winWidth
				pos = [(winWidth / 2) - (self.size[0] / 2), winHeight - (winWidth * 0.02) - self.size[1]]
				self.goal = Hitbox(0, winHeight - 7, winWidth, 50)
				self.side = "down"

		elif nb_total == 4:
			if (self.nb == 1):
				pos = [winWidth * 0.02, (winHeight / 2) - self.size[1]]
				self.goal = Hitbox(-50, 0, 50, winHeight)
				self.side = "left"
			elif (self.nb == 2):
				pos = [winWidth * 0.02 + 50, (winHeight / 2)]
				self.goal = Hitbox(-50, 0, 50, winHeight)
				self.side = "left"
			elif (self.nb == 3):
				pos = [winWidth - (winWidth * 0.02) - self.size[0], (winHeight / 2) - self.size[1]]
				self.goal = Hitbox(winWidth, 0, 50, winHeight)
				self.side = "right"
			else:
				pos = [winWidth - (winWidth * 0.02) - self.size[0] - 50, (winHeight / 2)]
				self.goal = Hitbox(winWidth, 0, 50, winHeight)
				self.side = "right"
     
		self.paddle = [Hitbox(pos=Vec2(pos=pos), size=self.size)]
		if borderless:
			self.paddle.append(Hitbox(pos[0], pos[1] - winHeight, size=self.size))
			self.paddle.append(Hitbox(pos[0], pos[1] + winHeight, size=self.size))
 
	def	moveUp(self, walls):
		init_speed = self.speed / 4
		tmp_speed = init_speed
		collision = False
		while walls and not collision and tmp_speed <= self.speed:
			tmp_pos = Vec2(self.paddle[0].pos.x, self.paddle[0].pos.y - tmp_speed)
			collision = is_colliding(tmp_pos, self.size, walls[0].hitbox.pos, walls[0].size)
			if collision:
				break
			tmp_speed += init_speed
		
		if not collision:
			self.paddle[0].pos.y -= self.speed
		else:
			self.paddle[0].pos.y = round(self.paddle[0].pos.y - (tmp_speed - init_speed))
			while not is_colliding(self.paddle[0].pos, self.size, walls[0].hitbox.pos, walls[0].size):
				self.paddle[0].pos.y -= 1

		if self.borderless:
			if self.paddle[0].pos.y + (self.size[1] / 2) < 0:
				self.paddle[0].pos.y += winHeight
			self.paddle[1].pos.y = self.paddle[0].pos.y - winHeight
			self.paddle[2].pos.y = self.paddle[0].pos.y + winHeight

			
	def moveDown(self, walls):
		init_speed = self.speed / 4
		tmp_speed = init_speed
		collision = False
		while walls and not collision and tmp_speed <= self.speed:
			tmp_pos = Vec2(self.paddle[0].pos.x, self.paddle[0].pos.y + tmp_speed)
			collision = is_colliding(tmp_pos, self.size, walls[1].hitbox.pos, walls[1].size)
			if collision:
				break
			tmp_speed += init_speed
		
		if not collision:
			self.paddle[0].pos.y += self.speed
		else:
			self.paddle[0].pos.y = round(self.paddle[0].pos.y + (tmp_speed - init_speed))
			while not is_colliding(self.paddle[0].pos, self.size, walls[1].hitbox.pos, walls[1].size):
				self.paddle[0].pos.y += 1
  
		if self.borderless:
			if self.paddle[0].pos.y + (self.size[1] / 2) >= winHeight:
				self.paddle[0].pos.y -= winHeight
			self.paddle[1].pos.y = self.paddle[0].pos.y - winHeight
			self.paddle[2].pos.y = self.paddle[0].pos.y + winHeight

	def moveLeft(self, walls):
		init_speed = self.speed / 4
		tmp_speed = init_speed
		collision = False
		while walls and not collision and tmp_speed <= self.speed:
			tmp_pos = Vec2(self.paddle[0].pos.x - tmp_speed, self.paddle[0].pos.y)
			collision = is_colliding(tmp_pos, self.size, walls[2].hitbox.pos, walls[2].size)
			if collision:
				break
			tmp_speed += init_speed
		
		if not collision:
			self.paddle[0].pos.x -= self.speed
		else:
			self.paddle[0].pos.x = round(self.paddle[0].pos.x - (tmp_speed - init_speed))
			while not is_colliding(self.paddle[0].pos, self.size, walls[2].hitbox.pos, walls[2].size):
				self.paddle[0].pos.x -= 1
   
	def moveRight(self, walls):
		init_speed = self.speed / 4
		tmp_speed = init_speed
		collision = False
		while walls and not collision and tmp_speed <= self.speed:
			tmp_pos = Vec2(self.paddle[0].pos.x + tmp_speed, self.paddle[0].pos.y)
			collision = is_colliding(tmp_pos, self.size, walls[3].hitbox.pos, walls[3].size)
			if collision:
				break
			tmp_speed += init_speed
		
		if not collision:
			self.paddle[0].pos.x += self.speed
		else:
			self.paddle[0].pos.x = round(self.paddle[0].pos.x + (tmp_speed - init_speed))
			while not is_colliding(self.paddle[0].pos, self.size, walls[3].hitbox.pos, walls[3].size):
				self.paddle[0].pos.x += 1


	def collide(self, ball):
		for paddle in self.paddle:
			ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
			if not is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, self.size):
				continue
			paddle.collidePaddle(ball, self.nb)
			break

	def update(self, delta):
		if self.borderless:
			self.paddle[1].pos.y = self.paddle[0].pos.y - winHeight
			self.paddle[2].pos.y = self.paddle[0].pos.y + winHeight
		self.speed = self.speed_per_sec * delta
