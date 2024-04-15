from .config import *
from .Vec2 import *
from .Hitbox import *

class AI:
	def __init__(self, player):
		self.id = player.nb
		self.side = player.side
		self.size = player.size
		self.time = 0
		self.pos = Vec2(pos=player.paddle[0].pos)
		self.center = Vec2(pos=self.pos)
		self.target = Vec2(pos=self.pos)
		self.moves = []
		if self.side == "left" or self.side == "right":
			self.hitbox = Hitbox(pos=Vec2(self.pos.x - 1, 0), width=player.size[0] + 2, height=winHeight)
		else:
			self.hitbox = Hitbox(pos=Vec2(0, self.pos.y - 1), width=winWidth, height=player.size[1] + 2)

	def update(self, core, core_delta):
		if core.ball.stick == self.id:
			self.moves.append("LAUNCH")
		else:
			tmp = time.time()
			delta = tmp - self.time
			if delta >= 1:
				self.predict(core, core_delta)
				self.time = tmp
			
			if self.target != self.pos:
				self.move()


	def predict(self, core, delta):
		sec_to_predict = 5

		ball_cpy = core.ball.copy(self.hitbox)

		collided = False
		for i in range(sec_to_predict * 100):
			ball_cpy.update(core, delta)
			ball_box = [ball_cpy.center[0].x - ball_cpy.radius, ball_cpy.center[0].y - ball_cpy.radius]
			if is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], self.hitbox.pos, self.hitbox.size):
				collided = True
				if is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], self.pos, self.size):
					break
				if self.side == "left" or self.side == "right":
					self.target = Vec2(self.pos.x, ball_cpy.center[0].y - (self.size[1] / 2))
				else:
					self.target = Vec2(ball_cpy.center[0].x - (self.size[0] / 2), self.pos.y)
				break

		if not collided:
			self.target = Vec2(pos=self.center)

		if is_colliding(ball_box, [ball_cpy.radius * 2, ball_cpy.radius * 2], self.pos, self.size):
			self.target = Vec2(pos=self.pos)
		elif self.target != self.center or (self.target == self.center and collided):
			if self.side == "left" or self.side == "right":
				self.target.y += randint(-(self.size[1] // 2 - 5), (self.size[1] // 2 - 5))
			else:
				self.target.x += randint(-(self.size[0] // 2 - 5), (self.size[0] // 2 - 5))
  

	def move(self):
		if self.target.x < self.pos.x:
			self.moves.append("LEFT")
		elif self.target.x > self.pos.x:
			self.moves.append("RIGHT")
		elif self.target.y < self.pos.y:
			self.moves.append("UP")
		elif self.target.y > self.pos.y:	
			self.moves.append("DOWN")
