from config import *
from Vec2 import *

class Obstacle:
	def __init__(self):
		self.center = Vec2(winWidth / 2, winHeight / 2)
		self.radius = 150
		self.solid = False
		self.start = time.time()
  
	def update(self):
		if not self.solid and time.time() - self.start >= 4:
			self.solid = True
  
	def collide(self, ball):
		rad = radians(ball.dir)
		dir = Vec2(cos(rad), sin(rad))
		norm = ball.center[0] - self.center
		norm.normalize()

		norm.scale(dotProduct(dir, norm) * 2)
		res = dir - norm
  
		rad = atan2(res.y, res.x)
		ball.dir = degrees(rad)