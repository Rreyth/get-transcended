from .config import *
from random import randint

class Ball:
	def __init__(self, borderless):
		self.borderless = borderless
		self.radius = 7
		self.initHitbox(borderless)

		self.stick = 0
		self.side = "none"
		self.launch()
  
		self.multiplier = 1.0
		self.last_hit = 0

	def initHitbox(self, borderless):
		center = [winWidth / 2, winHeight / 2]
		self.hitbox = [pg.Rect([center[0] - self.radius, center[1] - self.radius], [self.radius * 2, self.radius * 2])]
		if borderless:
			self.hitbox.append(pg.Rect([center[0] - self.radius, center[1] - self.radius - winHeight], [self.radius * 2, self.radius * 2]))
			self.hitbox.append(pg.Rect([center[0] - self.radius, center[1] - self.radius + winHeight], [self.radius * 2, self.radius * 2]))


	def move(self, players, walls):
		if self.stick != 0:
			for player in players:
				if player.nb == self.stick:
					self.side = player.side
					if player.side == "left":
						self.hitbox[0].center = (player.paddle[0].centerx + 25, player.paddle[0].centery)
					if player.side == "right":
						self.hitbox[0].center = (player.paddle[0].centerx - 25, player.paddle[0].centery)
					if player.side == "up":
						self.hitbox[0].center = (player.paddle[0].centerx, player.paddle[0].centery + 25)
					if player.side == "down":
						self.hitbox[0].center = (player.paddle[0].centerx, player.paddle[0].centery - 25)
			return
		rad = math.radians(self.dir)
		if self.radius > self.speed:
			new_x = self.hitbox[0].centerx + (self.speed * math.cos(rad))
			new_y = self.hitbox[0].centery + (self.speed * math.sin(rad))
			self.hitbox[0].center = (new_x, new_y)
			return

		tmp_speed = self.radius
		collision = False
		while not collision and tmp_speed <= self.speed:
			for hitbox in self.hitbox:
				tmp_x = hitbox.centerx + (tmp_speed * math.cos(rad))
				tmp_y = hitbox.centery + (tmp_speed * math.sin(rad))
				collision = try_collide(tmp_x, tmp_y, self.radius, players, walls)
				if collision:
					break
			tmp_speed += self.radius

		if collision:
			self.hitbox[0].center = (tmp_x, tmp_y)
		else:
			new_x = self.hitbox[0].centerx + (self.speed * math.cos(rad))
			new_y = self.hitbox[0].centery + (self.speed * math.sin(rad))
			self.hitbox[0].center = (new_x, new_y)
  
	def collide(self, walls, players):
		rad = math.radians(self.dir)
		dx = math.cos(rad)
		dy = math.sin(rad)
		if walls:
			for wall in walls:
				if self.hitbox[0].colliderect(wall.hitbox):
					dy = -dy
					while self.hitbox[0].colliderect(wall.hitbox):
						if wall.pos == "up":
							self.hitbox[0].centery += 1
						else:
							self.hitbox[0].centery -= 1
					rad = math.atan2(dy, dx)
					self.dir = math.degrees(rad) % 360
	
		for player in players:
			for paddle in player.paddle:
				for hitbox in self.hitbox:
					if hitbox.colliderect(paddle):
						diff_x = (hitbox.center[0] - paddle.center[0]) / (paddle.size[0] / 2)
						tmp = diff_x
						if diff_x > 1 or diff_x < -1:
							diff_x = diff_x % 1 if diff_x > 0 else diff_x % -1
						if tmp != diff_x and diff_x == 0:
							diff_x = 1 if tmp > 0 else -1 
						diff_y = (hitbox.center[1] - paddle.center[1]) / (paddle.size[1] / 2)

						max = 45
						if (diff_y >= 1):
							self.dir = (max * (-diff_x)) + 90
							while hitbox.colliderect(paddle):
								hitbox.centery += 1
						elif (diff_y <= -1):
							self.dir = (max * diff_x) + 270
							while hitbox.colliderect(paddle):
								hitbox.centery -= 1
						elif (diff_x >= 0):
							self.dir = max * diff_y
							while hitbox.colliderect(paddle):
								hitbox.centerx += 1
						else:
							self.dir = (max * (-diff_y)) + 180
							while hitbox.colliderect(paddle):
								hitbox.centerx -= 1
						if (self.multiplier < 5):
							self.multiplier += 0.1
						self.last_hit = player.nb
						break
  
	def update(self, walls, players, delta, mod):
		self.speed = ball_speed_per_sec * delta * self.multiplier
		self.move(players, walls)
		self.collide(walls, players)
		self.goal(players, mod)
		self.unstuck(mod)

		if self.borderless:
			if self.hitbox[0].centery < 0:
				self.hitbox[0].centery += winHeight
			if self.hitbox[0].centery >= winHeight:
				self.hitbox[0].centery -= winHeight
			self.hitbox[1].centerx = self.hitbox[0].centerx
			self.hitbox[1].centery = self.hitbox[0].centery - winHeight
			self.hitbox[2].centerx = self.hitbox[0].centerx
			self.hitbox[2].centery = self.hitbox[0].centery + winHeight

  
	def draw(self, win):
		for ball in self.hitbox:
			pg.draw.circle(win, (255, 255, 255), ball.center, self.radius)

	def unstuck(self, mod):
		if mod == "1V1V1V1":
			return
		if round(self.dir) % 360 in range(85, 96) or round(self.dir) % 360 in range(-275, -264):
			if (self.last_hit == 1):
				self.dir -= 5
			else:
				self.dir += 5
		if round(self.dir) % 360 in range(265, 276) or round(self.dir) % 360 in range(-95, -86):
			if (self.last_hit == 1):
				self.dir += 5
			else:
				self.dir -= 5
	
	def goal(self, players, mod):
		for player in players:
			if self.hitbox[0].colliderect(player.goal):
				if players.__len__() == 2:
					if player.nb == 1:
						players[1].score += 1
					else:
						players[0].score += 1
				elif mod == "1V1V1V1":
					if player.nb == self.last_hit:
						player.score -= 1
					elif self.last_hit:
						players[self.last_hit - 1].score += 1
					else:
						out = player.nb
						for other in players:
							if other.nb != out:
								other.score += 1
				elif players.__len__() == 4:
					if player.nb == 1 or player.nb == 2:
						players[2].score += 1
					else:
						players[0].score += 1
				self.stick = player.nb
				self.multiplier = 1.0
				break

	def launch(self):
		if self.stick == 0:
			self.dir = randint(0, 359)
			while self.dir in range(75, 106) or self.dir in range(255, 286):
				self.dir = randint(0, 359)
		else:
			if self.side == "left":
				self.dir = 0
			elif self.side == "right":
				self.dir = 180
			elif self.side == "up":
				self.dir = 90
			elif self.side == "down":
				self.dir = 270
	  
		self.stick = 0
  
  
def try_collide(x, y, radius, players, walls):
	tmp_rect = pg.Rect([x - radius, y - radius], [radius * 2, radius * 2])
	
	for player in players:
		for paddle in player.paddle:
			if tmp_rect.colliderect(paddle):
				return True
	if not walls:
		return False
	for wall in walls:
		if tmp_rect.colliderect(wall.hitbox):
			return True
	return False