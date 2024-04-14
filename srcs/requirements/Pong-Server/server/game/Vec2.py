from math import *

class Vec2:
	def __init__(self, x = 0, y = 0, pos = False):
		if pos:
			self.x = pos[0]
			self.y = pos[1]
		else:
			self.x = x
			self.y = y
	
	def __add__(self, other):
		return Vec2(self.x + other.x, self.y + other.y)

	def __sub__(self, other):
		return Vec2(self.x - other.x, self.y - other.y)

	def __getitem__(self, key):
		if key == 0:
			return self.x
		return self.y

	def __ne__(self, other):
		return self.x != other.x or self.y != other.y

	def __eq__(self, other):
		return self.x == other.x and self.y == other.y

	def scale(self, nb):
		self.x *= nb
		self.y *= nb

	def div(self, nb):
		if nb == 0:
			return
		self.x /= nb
		self.y /= nb

	def move(self, speed, dist):
		self.x += (speed.x * dist)
		self.y += (speed.y * dist)
  
	def normalize(self):
		len = sqrt((self.x * self.x) + (self.y * self.y))
		self.div(len)

def dotProduct(v1, v2):
	return ((v1.x * v2.x) + (v1.y * v2.y))

def crossProduct(v1, v2):
	return ((v1.x * v2.y) - (v1.y * v2.x))

def getDist(v1, v2):
	dx = pow(v2.x - v1.x, 2)
	dy = pow(v2.y - v1.y, 2)
	return sqrt(dx + dy)