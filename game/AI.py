from .config import *
import time

class AI:
	def __init__(self, ai):
		self.time = 0
		self.target = ai.paddle.topleft

	def update(self, core, ai):
		# if core.ball.stick == ai.nb:
		# 	core.keyboardState[pg.K_KP5] = 1
		# 	# pg.key.set_pressed(core.keyboardState)
		tmp = time.time()
		delta = tmp - self.time
		if delta >= 1:
			self.predict(core, ai)
			self.time = tmp
		
		if self.target != ai.paddle.topleft:
			self.move(ai)
 
	def predict(self, core, ai):
		print("PREDICT")
		#copie du core, simule les 5-10 prochaines secondes du jeu

	def move(self, ai):
		print("MOVE")
		if self.target[1] < ai.paddle.y:
			pass #keypress 8
		if self.target[1] > ai.paddle.y:
			pass #keypress 2