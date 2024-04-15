from .config import *
from .Button import *

class WaitScreen:
	def __init__(self, id, nb, nb_players, mode):
		self.mode = mode
		self.id = id
		self.nb_max = nb_players
		self.nb = nb
		self.font = pg.font.Font(font, int(winHeight * 0.085))
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.player_input = [Button("BACK TO MENU", (winWidth / 2) - (self.size[0] / 2), winHeight - self.size[1] - 25 , self.size[0], self.size[1], winHeight * 0.085)]


	def draw(self, win):
		for button in self.player_input:
			button.draw(win)
		text = self.font.render("WAITING FOR PLAYERS", True, (255, 255, 255))
		win.blit(text, ((winWidth / 2) - (text.get_size()[0] / 2), 25))
		text = self.font.render("ID : " + str(self.id), True, (255, 255, 255))
		win.blit(text, (10, 25))
		text = self.font.render(str(self.nb) + " / " + str(self.nb_max), True, (255, 255, 255))
		win.blit(text, ((winWidth / 2) - (text.get_size()[0] / 2), 60 + text.get_size()[1]))

	async def click(self, core, mousePos):
		if self.player_input[0].hitbox.collidepoint(mousePos):
			core.state = "menu"
			core.mode = "none"
			if core.GameRoom:
				await core.GameRoom.send(json.dumps({'type' : 'quitGame', 'id' : core.id, 'cmd' : 'quitWait'}))
			else:
				await core.GameHub.send(json.dumps({'type' : 'quitGame', 'id' : core.id, 'cmd' : 'quitWait'}))