from config import *
from Vec2 import *
from Hitbox import *

class Wall:
	def __init__(self, pos, square):
		self.size = [winWidth ,5]
		self.pos = pos
		self.square = square

		if not square:
			if pos == "up":
				self.visual = [0, wallDist - (self.size[1] / 2)]
				self.hitbox = Hitbox(pos=Vec2(self.visual[0], self.visual[1] + 2), size=self.size)
			elif pos == "down":
				self.visual = [0, winHeight - wallDist - (self.size[1] / 2)]
				self.hitbox = Hitbox(pos=Vec2(self.visual[0], self.visual[1] - 3), size=self.size)

		else:
			if pos == "up":
				self.visual = [0, 0]
			elif pos == "down":
				self.visual = [0, winHeight - self.size[1]]
			elif pos == "left":
				self.size.reverse()
				self.visual = [0, 0]
			elif pos == "right":
				self.size.reverse()
				self.visual = [winWidth - self.size[0], 0]
			self.hitbox = Hitbox(pos=Vec2(pos=self.visual), size=self.size)

	def collide(self, ball):
		ball_box = [ball.center[0].x - ball.radius, ball.center[0].y - ball.radius]
		if not is_colliding(ball_box, [ball.radius * 2, ball.radius * 2], self.hitbox.pos, self.size):
			return
		self.hitbox.collideWall(ball, self.pos)

