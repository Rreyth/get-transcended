from .config import *
from .Vec2 import *

class Obstacle:
	def __init__(self):
		self.center = Vec2(winWidth / 2, winHeight / 2)
		self.radius = 50
  
	def draw(self, win):
		pg.draw.circle(win, (255, 255, 255), (self.center.x, self.center.y), self.radius)
  
	def collide(self, ball):
		# verif collision ici ou avant ?
		rad = radians(ball.dir)
		dir = Vec2(cos(rad), sin(rad))
		norm = ball.vec - self.center
		norm.normalize()
  
		res = dir - norm.scale(dotProduct(dir, norm) * 2)
  
		rad = atan2(res.y, res.x)
		ball.dir = degrees(rad)