from .config import *
from .Vec2 import *
from random import randint

class Ball:
	def __init__(self, borderless):
		self.borderless = borderless
		self.radius = 7
		self.center = [Vec2(winWidth / 2, winHeight / 2)]
		if borderless:
			self.center.append(Vec2(self.center[0].x, self.center[0].y + winHeight))
			self.center.append(Vec2(self.center[0].x, self.center[0].y - winHeight))

		self.stick = 0
		self.side = "none"
		self.launch()
  
		self.multiplier = 1.0
		self.last_hit = 0


	def move(self, players, walls, obstacle):
		if self.stick != 0:
			for player in players:
				if player.nb == self.stick:
					self.side = player.side
					if player.side == "left":
						self.center[0] = Vec2((player.paddle[0].pos.x + (player.size[0] / 2)) + 25, player.paddle[0].pos.y + (player.size[1] / 2))
					if player.side == "right":
						self.center[0] = Vec2((player.paddle[0].pos.x + (player.size[0] / 2)) - 25, player.paddle[0].pos.y + (player.size[1] / 2))
					if player.side == "up":
						self.center[0] = Vec2(player.paddle[0].pos.x + (player.size[0] / 2), (player.paddle[0].pos.y + (player.size[1] / 2)) + 25)
					if player.side == "down":
						self.center[0] = Vec2(player.paddle[0].pos.x + (player.size[0] / 2), (player.paddle[0].pos.y + (player.size[1] / 2)) - 25)
			return

		rad = radians(self.dir)
		if self.radius > self.speed:
			new_x = self.center[0].x + (self.speed * cos(rad))
			new_y = self.center[0].y + (self.speed * sin(rad))
			self.center[0].x = new_x
			self.center[0].y = new_y
			return

		tmp_speed = self.radius
		collision = False
		while not collision and tmp_speed <= self.speed:
			for center in self.center:
				tmp_x = center.x + (tmp_speed * cos(rad))
				tmp_y = center.y + (tmp_speed * sin(rad))
				collision = try_collide(tmp_x, tmp_y, self.radius, players, walls, obstacle)
				if collision:
					break
			tmp_speed += self.radius

		if collision:
			new_x = tmp_x
			new_y = tmp_y
		else:
			new_x = self.center[0].x + (self.speed * cos(rad))
			new_y = self.center[0].y + (self.speed * sin(rad))

		self.center[0].x = new_x
		self.center[0].y = new_y
  
	def collide(self, walls, players, obstacle):
		if obstacle:
			if getDist(self.center[0], obstacle.center) <= self.radius + obstacle.radius and obstacle.solid:
				obstacle.collide(self)
		if walls:
			for wall in walls:
				wall.collide(self)

		for player in players:
			player.collide(self)
		
  
	def update(self, core, delta):
		self.speed = ball_speed_per_sec * delta * self.multiplier
		self.move(core.players, core.walls, core.obstacle)
		self.collide(core.walls, core.players, core.obstacle)
		self.goal(core.players, core.custom_mod)
		self.unstuck(core.custom_mod)

		if self.borderless:
			if self.center[0].y < 0:
				self.center[0].y += winHeight
			if self.center[0].y >= winHeight:
				self.center[0].y -= winHeight
			self.center[1].x = self.center[0].x
			self.center[1].y = self.center[0].y - winHeight
			self.center[2].x = self.center[0].x
			self.center[2].y = self.center[0].y + winHeight

  
	def draw(self, win):
		for center in self.center:
			pg.draw.circle(win, (255, 255, 255), (center.x, center.y), self.radius)

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
		ball_box = [self.center[0].x - self.radius, self.center[0].y - self.radius]
		for player in players:
			if is_colliding(ball_box, [self.radius * 2, self.radius * 2], player.goal.pos, player.goal.size):
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
  
  
def try_collide(x, y, radius, players, walls, obstacle):
	tmp = [x - radius, y - radius]
	
	for player in players:
		for paddle in player.paddle:
			if is_colliding(tmp, [radius * 2, radius * 2], paddle.pos, player.size):
				return True

	if obstacle and getDist(Vec2(x, y), obstacle.center) <= radius + obstacle.radius and obstacle.solid:
		return True

	if not walls:
		return False
	for wall in walls:
		if is_colliding(tmp, [radius * 2, radius * 2], wall.hitbox.pos, wall.size):
			return True
	return False