from .Button import *
from .config import *

class Arrow(Button):
	def __init__(self, name, x, y, width, height, text_size, dir):
		super().__init__(name, x, y, width, height, text_size)
		self.dir = dir
  
	def draw(self, win):
		if self.dir == 'up':
			pos = [[self.x, self.y + self.height], [self.x + (self.width / 2), self.y], [self.x + self.width, self.y + self.height]]
		else:
			pos = [[self.x, self.y], [self.x + (self.width / 2), self.y + self.height], [self.x + self.width, self.y]]
   
		pg.draw.polygon(win, (255, 255, 255), pos)