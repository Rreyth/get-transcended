import game.config as conf

class Ball:
	# speed = 5
	dx = 4
	dy = 0
	rad = 10
	def __init__(self):
		self.center = [conf.winWidth / 2, conf.winHeight / 2]
		self.hitbox = conf.pg.Rect([self.center[0] - self.rad, self.center[1] - self.rad], [self.rad * 2, self.rad * 2])

	def move(self):
		self.hitbox.move_ip(self.dx, self.dy)
  
	def collide(self, walls, players):
		for wall in walls:
			if self.hitbox.colliderect(wall.hitbox):
				self.dy = -self.dy
    
		for player in players:
			if self.hitbox.colliderect(player.paddle):
				# y ball - y paddle positif si en dessous negatif si au dessus #do same pour x pour les collision sur les cotes du paddle
				contact = self.hitbox.center[1] - player.paddle.center[1]
				print(contact)
				self.dx = -self.dx
  
	def update(self, walls, players):
		self.move()
		self.collide(walls, players)
  
	def draw(self, win):
		conf.pg.draw.circle(win, (255, 255, 255), self.hitbox.center, self.rad)