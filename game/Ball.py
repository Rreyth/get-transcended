from .config import *
from random import randint

class Ball:
	def __init__(self):
		self.radius = 10
		center = [winWidth / 2, winHeight / 2]
		self.hitbox = pg.Rect([center[0] - self.radius, center[1] - self.radius], [self.radius * 2, self.radius * 2])

		self.stick = 0
		self.launch()
  
		self.multiplier = 1.0
		self.last_hit = 0

	def move(self, players):
		if self.stick != 0:
			for player in players:
				if player.nb == self.stick:
					if player.nb == 1:
						self.hitbox.center = (player.paddle.centerx + 25, player.paddle.centery)
					if player.nb == 2:
						self.hitbox.center = (player.paddle.centerx - 25, player.paddle.centery)
		else:
			rad = math.radians(self.dir)
			new_x = self.hitbox.centerx + (self.speed * math.cos(rad))
			new_y = self.hitbox.centery + (self.speed * math.sin(rad))
			self.hitbox.center = (new_x, new_y)
  
	def collide(self, walls, players):
		rad = math.radians(self.dir)
		dx = math.cos(rad)
		dy = math.sin(rad)

		for wall in walls:
			if self.hitbox.colliderect(wall.hitbox):
				dy = -dy
				while self.hitbox.colliderect(wall.hitbox):
					if wall.pos == "up":
						self.hitbox.centery += 1
					else:
						self.hitbox.centery -= 1
				rad = math.atan2(dy, dx)
				self.dir = math.degrees(rad) % 360
	
		for player in players:
			if self.hitbox.colliderect(player.paddle):
				diff_x = (self.hitbox.center[0] - player.paddle.center[0]) / (player.paddle.size[0] / 2)
				diff_y = (self.hitbox.center[1] - player.paddle.center[1]) / (player.paddle.size[1] / 2)
	
				max = 45
				if (diff_y >= 1):
					self.dir = (max * diff_x) + 90
				elif (diff_y <= -1):
					self.dir = (max * (-diff_x)) + 90
				elif (diff_x >= 0):
					self.dir = max * diff_y
				else:
					self.dir = (max * (-diff_y)) + 180
				if (self.multiplier < 5):
					self.multiplier += 0.1
				self.last_hit = player.nb
  
	def update(self, walls, players, delta):
		self.speed = ball_speed_per_sec * delta * self.multiplier
		self.move(players)
		self.collide(walls, players)
		self.goal(players)
		self.unstuck()
  
	def draw(self, win):
		pg.draw.circle(win, (255, 255, 255), self.hitbox.center, self.radius)

	def unstuck(self):
		if round(self.dir) % 360 in range(88, 93) or round(self.dir) % 360 in range(-272, -268):
			if (self.last_hit == 1):
				self.dir -= 5
			else:
				self.dir += 5
		if round(self.dir) % 360 in range(268, 273) or round(self.dir) % 360 in range(-92, -89):
			if (self.last_hit == 1):
				self.dir += 5
			else:
				self.dir -= 5
	
	def goal(self, players):
		for player in players:
			if self.hitbox.colliderect(player.goal):
				if player.nb == 1:
					players[1].score += 1
				else:
					players[0].score += 1
				self.stick = player.nb
				self.multiplier = 1.0

	def launch(self):
		if self.stick == 0:
			self.dir = randint(0, 359)
			while self.dir in range(75, 106) or self.dir in range(255, 286):
				self.dir = randint(0, 359)
		if self.stick == 1:
			self.dir = 0
		elif self.stick == 2:
			self.dir = 180
      
		self.stick = 0