from config import *
from Vec2 import *

class Hitbox:
	def __init__(self, x = 0, y = 0, width = 0, height = 0, pos = False, size = False):
		if pos:
			self.pos = pos
		else:
			self.pos = Vec2(x, y)
		if size:
			self.size = size
		else:
			self.size = [width, height]
   
	def collideWall(self, ball, pos):
		rad = radians(ball.dir)
		dir = Vec2(cos(rad), sin(rad))
  
		if pos == "up" or pos == "down":
			dir.y = -dir.y
		else:
			dir.x = -dir.x

		ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], self.pos, self.size):
			if pos == "up":
				ball.center[0].y += 1
			elif pos == "down":
				ball.center[0].y -= 1
			elif pos == "left":
				ball.center[0].x += 1
			else:
				ball.center[0].x -= 1
			ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]

		rad = atan2(dir.y, dir.x)
		ball.dir = degrees(rad) % 360
  
	def collidePaddle(self, ball, nb):
		diff_x = (ball.center[0].x - (self.pos.x + (self.size[0] / 2))) / (self.size[0] / 2)
		tmp = diff_x
		if diff_x > 1 or diff_x < -1:
			diff_x = diff_x % 1 if diff_x > 0 else diff_x % -1
		if tmp != diff_x and diff_x == 0:
			diff_x = 1 if tmp > 0 else -1
		diff_y = (ball.center[0].y - (self.pos.y + (self.size[1] / 2))) / (self.size[1] / 2)

		ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		max = 45
		if diff_y >= 1:
			ball.dir = (max * (-diff_x)) + 90
			while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], self.pos, self.size):
				ball.center[0].y += 1
				ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		elif diff_y <= -1:
			ball.dir = (max * diff_x) + 270
			while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], self.pos, self.size):
				ball.center[0].y -= 1
				ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		elif diff_x >= 0:
			ball.dir = max * diff_y
			while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], self.pos, self.size):
				ball.center[0].x += 1
				ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		else:
			ball.dir = (max * (-diff_y)) + 180
			while is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], self.pos, self.size):
				ball.center[0].x -= 1
				ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		if ball.multiplier < 5:
			ball.multiplier += 0.1
		ball.last_hit = nb
