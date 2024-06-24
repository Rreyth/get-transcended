from config import *
from Vec2 import *
from Ball import try_collide

class Obstacle:
	def __init__(self):
		self.center = Vec2(winWidth / 2, winHeight / 2)
		self.radius = int(winHeight * 0.193)
		self.solid = False
		self.start = time.time()
  
	def update(self):
		if not self.solid and time.time() - self.start >= 3.5:
			self.solid = True
  
	def collide(self, ball):
		rad = radians(ball.dir)
		dir = Vec2(cos(rad), sin(rad))
		norm = ball.center[0] - self.center
		norm.normalize()

		norm.scale(dotProduct(dir, norm) * 2)
		res = dir - norm
  
		self.unstuckBall(ball, rad)

		rad = atan2(res.y, res.x)
		ball.dir = degrees(rad)

	def unstuckBall(self, ball, rad):
		while try_collide(ball.center[0].x, ball.center[0].y, ball.radius, [], False, self, ball.ai_hitbox):
			ball.center[0].x -= (1 * cos(rad))
			ball.center[0].y -= (1 * sin(rad))
