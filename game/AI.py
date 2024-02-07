from .config import *
import time
import copy

class AI: #pygame fait chier, le mode standalone aussi, si je veux avancer sur l'ia il vaut mieux passer en mode serv-cli
	def __init__(self, ai):
		self.time = 0
		self.pos = ai.paddle[0].topleft
		self.target = ai.paddle[0].topleft

	def update(self, core, ai):
		# if core.ball.stick == ai.nb: # standby, when client version, launch msg to serv
		# 	pg.event.post(pg.event.Event(pg.KEYDOWN, key = pg.K_KP5))
		tmp = time.time()
		delta = tmp - self.time
		if delta >= 1:
			self.predict(core)
			self.time = tmp
		
		if self.target != ai.paddle[0].topleft:
			self.move(ai)
 
	def predict(self, core):
		pass
		# tmp = copy.deepcopy(core)
		# tmp.test = "mabit"
		#copie du core, simule les 5-10 prochaines secondes du jeu

	def move(self, ai):
		pass
		if self.target[1] < ai.paddle[0].y:
			pass #keypress 8
		if self.target[1] > ai.paddle[0].y:
			pass #keypress 2