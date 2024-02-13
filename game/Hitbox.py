from .config import *
from .Vec2 import *

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