from .config import *
from .Button import *


class StartScreen:
	def __init__(self, mode, online = False, square = False, nb_players = 2):
		self.mode = mode
		self.online = online
		self.timer = 3
		self.time = time.time()
		self.font = pg.font.Font(font, int(winHeight * 0.085))
		self.size = [150, 100]
		self.player_input = {}
		if mode == "LOCAL" or (mode == 'custom' and nb_players == 2 and not online):
			self.player_input = {1 : [Button("W", (winWidth / 4) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", (winWidth / 4) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", (winWidth / 4) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("UP", (winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", (winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("NUM0", (winWidth / 4 * 3) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]}

		elif mode != "custom":
			self.player_input = {1 : [Button("W", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", (winWidth / 5) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("UP", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]}
			if online:
				self.player_input[2] = [Button("UP", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", winWidth - (winWidth / 4 + self.size[0]) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("W", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]

		else:
			if online:
				if not square:
					self.player_input = {1 : [Button("W", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", (winWidth / 5) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("UP", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]}
					if 	nb_players == 4:
						self.player_input[2] = self.player_input[1].copy()
					else:
						self.player_input[2] = [Button("UP", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", winWidth - (winWidth / 4 + self.size[0]) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("W", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]
					self.player_input[3] = [Button("UP", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", winWidth - (winWidth / 4 + self.size[0]) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("W", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]
					self.player_input[4] = self.player_input[3].copy()

				else:
					self.player_input = {1 : [Button("Space", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("UP", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)],
                        2 : [Button("UP", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)],
                        3 : [Button("LEFT", (winWidth / 3) - (self.size[0] / 2), (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("RIGHT", (winWidth / 2) - (self.size[0] / 2), (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", (winWidth / 3 * 2) - (self.size[1] / 2), (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)],
                        4 : [Button("LEFT", (winWidth / 3) - (self.size[0] / 2), winHeight - (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("RIGHT", (winWidth / 2) - (self.size[0] / 2), winHeight - (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", (winWidth / 3 * 2) - (self.size[1] / 2), winHeight - (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]}
   
			else:
				if not square:
					self.player_input = {1 : [Button("W", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Space", (winWidth / 5) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]}
					if 	nb_players == 4:
						self.player_input[2] = [Button("T", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("G", (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]
					else:
						self.player_input[2] = [Button("UP", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("NUM0", winWidth - (winWidth / 4 + self.size[0]) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]

					self.player_input[3] = [Button("NUM8", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("NUM5", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("NUM0", winWidth - (winWidth / 4 + self.size[0]) + (self.size[0] * 0.275), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]

					self.player_input[4] = [Button("UP", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 4 + self.size[0]) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]
     
				else:
					self.player_input = {1 : [Button("Space", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("W", (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("S", (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)],
                        2 : [Button("UP", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("DOWN", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("NUM0", winWidth - (winWidth / 5) - (self.size[0] / 2), (winHeight / 3 * 2) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)],
                        3 : [Button("T", (winWidth / 2) - (self.size[0] * 1.7), (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("Y", (winWidth / 2) - (self.size[0] / 2), (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("H", (winWidth / 2) + (self.size[0] * 0.7), (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)],
                        4 : [Button("K", (winWidth / 2) - (self.size[0] * 1.7), winHeight - (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("L", (winWidth / 2) - (self.size[0] / 2), winHeight - (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085),
						Button("O", (winWidth / 2) + (self.size[0] * 0.7), winHeight - (winHeight / 5) - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085)]}


	def draw(self, win, player_id):
		if self.online:
			for id in self.player_input.keys():
				if id == player_id:
					for button in self.player_input[id]:
						button.draw(win)
					break
		else:
			for inputs in self.player_input.values():
				for button in inputs:
					button.draw(win)

		timer = self.font.render(str(self.timer), True, (255, 255, 255))
		win.blit(timer, ((winWidth / 2) - (timer.get_size()[0] / 2), (winHeight / 2) - (timer.get_size()[1] / 2)))
  
	def update(self):
		tmp = time.time()
		delta = tmp - self.time
		if delta >= 1:
			self.time = tmp
			self.timer -= 1
