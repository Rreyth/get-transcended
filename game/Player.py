from .config import *
from .Vec2 import *
from .Hitbox import *

class Player:
	def __init__(self, nb, name, nb_total, borderless, square):
		self.borderless = borderless
		self.speed_per_sec = speed_per_sec
		self.speed = self.speed_per_sec * 0.005
		self.nb = nb
		self.name = name
		self.win = "LOOSE"
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
				self.goal = Hitbox(0, 0, 10, winHeight)
				self.side = "left"
			elif (self.nb == 2):
				pos = [winWidth - (winWidth * 0.02) - self.size[0], (winHeight / 2) - (self.size[1] / 2)]
				self.goal = Hitbox(winWidth - 10, 0, 10, winHeight)
				self.side = "right"
			elif (self.nb == 3):
				self.size.reverse()
				self.speed_per_sec = winWidth
				pos = [(winWidth / 2) - (self.size[0] / 2), (winWidth * 0.02)]
				self.goal = Hitbox(0, 0, winWidth, 10)
				self.side = "up"
			else:
				self.size.reverse()
				self.speed_per_sec = winWidth
				pos = [(winWidth / 2) - (self.size[0] / 2), winHeight - (winWidth * 0.02) - self.size[1]]
				self.goal = Hitbox(0, winHeight - 10, winWidth, 10)
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
		self.paddle[0].pos.y -= self.speed
		while walls and is_colliding(self.paddle[0].pos, self.size, walls[0].hitbox.pos, walls[0].size):
			self.paddle[0].pos.y += 1
		if self.borderless:
			if self.paddle[0].pos.y + (self.size[1] / 2) < 0:
				self.paddle[0].pos.y += winHeight
			self.paddle[1].pos.y = self.paddle[0].pos.y - winHeight
			self.paddle[2].pos.y = self.paddle[0].pos.y + winHeight
			
	def moveDown(self, walls):
		self.paddle[0].pos.y += self.speed
		while walls and is_colliding(self.paddle[0].pos, self.size, walls[1].hitbox.pos, walls[1].size):
			self.paddle[0].pos.y -= 1
		if self.borderless:
			if self.paddle[0].pos.y + (self.size[1] / 2) >= winHeight:
				self.paddle[0].pos.y -= winHeight
			self.paddle[1].pos.y = self.paddle[0].pos.y - winHeight
			self.paddle[2].pos.y = self.paddle[0].pos.y + winHeight

	def moveLeft(self, walls):
		self.paddle[0].pos.x -= self.speed
		while is_colliding(self.paddle[0].pos, self.size, walls[2].hitbox.pos, walls[2].size):
			self.paddle[0].pos.x += 1
   
	def moveRight(self, walls):
		self.paddle[0].pos.x += self.speed
		while is_colliding(self.paddle[0].pos, self.size, walls[3].hitbox.pos, walls[3].size):
			self.paddle[0].pos.x -= 1

	def draw(self, win):
		for paddle in self.paddle:
			pg.draw.rect(win, (255, 255, 255), pg.Rect((paddle.pos.x, paddle.pos.y), self.size))
		# pg.draw.rect(win, (255, 0, 0), pg.Rect((self.goal.pos.x, self.goal.pos.y), self.goal.size))

	def collide(self, ball):
		for paddle in self.paddle:
			ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
			if not is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, self.size):
				continue
   
			diff_x = (ball.center[0].x - (paddle.pos.x + (self.size[0] / 2))) / (self.size[0] / 2)
			tmp = diff_x
			if diff_x > 1 or diff_x < -1:
				diff_x = diff_x % 1 if diff_x > 0 else diff_x % -1
			if tmp != diff_x and diff_x == 0:
				diff_x = 1 if tmp > 0 else -1
			diff_y = (ball.center[0].y - (paddle.pos.y + (self.size[1] / 2))) / (self.size[1] / 2)

			max = 45
			if diff_y >= 1:
				ball.dir = (max * (-diff_x)) + 90
				while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, self.size):
					ball.center[0].y += 1
					ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
			elif diff_y <= -1:
				ball.dir = (max * diff_x) + 270
				while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, self.size):
					ball.center[0].y -= 1
					ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
			elif diff_x >= 0:
				ball.dir = max * diff_y
				while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, self.size):
					ball.center[0].x += 1
					ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
			else:
				ball.dir = (max * (-diff_y)) + 180
				while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], paddle.pos, self.size):
					ball.center[0].x -= 1
					ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
			if ball.multiplier < 5:
				ball.multiplier += 0.1
			ball.last_hit = self.nb
			break
