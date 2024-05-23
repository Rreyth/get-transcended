from .config import *
from .Button import *
from .Wall import *
from .Player import *
from .Obstacle import *
from .Ball import *
from .Vec2 import *
from .StartScreen import *
from .TournamentNames import *
from .Tournament import *

class TournamentMenu:
	def __init__(self):
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.mod_size = [winWidth * 0.11, winHeight * 0.07]
		self.score = 10
		self.ai_nb = 0
		self.max_ai = 2
		self.nb_players = 2
		self.down_buttons = [Button("BACK TO MENU", self.size[0] * 0.1, winHeight - (self.size[1] * 1.4), self.size[0], self.size[1], winHeight * 0.085),
				Button("START", winWidth - (self.size[0] * 1.1), winHeight - (self.size[1] * 1.4), self.size[0], self.size[1], winHeight * 0.085)]
		self.mod_buttons = [Button("LOCAL", winWidth / 5 - (self.mod_size[0] / 2), winHeight / 3 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
              	Button("ONLINE", winWidth / 5 * 2 - (self.mod_size[0] / 2), winHeight / 3 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
          		Button("BORDERLESS", winWidth / 5 * 3 - (self.mod_size[0] / 2), winHeight / 3 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06),
            	Button("OBSTACLE", winWidth / 5 * 4 - (self.mod_size[0] / 2), winHeight / 3 - (self.mod_size[1] / 2), self.mod_size[0], self.mod_size[1], winHeight * 0.06)]
		self.param_buttons = [Button("-", winWidth * 0.335, winHeight / 3 * 2 - (winHeight * 0.025), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("+", winWidth * 0.355, winHeight / 3 * 2 - (winHeight * 0.025), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("-", winWidth * 0.56, winHeight / 3 * 2 - (winHeight * 0.025), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("+", winWidth * 0.58, winHeight / 3 * 2 - (winHeight * 0.025), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("-", winWidth * 0.785, winHeight / 3 * 2 - (winHeight * 0.025), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06),
				Button("+", winWidth * 0.805, winHeight / 3 * 2 - (winHeight * 0.025), winWidth * 0.015, winHeight * 0.03, winHeight * 0.06)]
		self.mod_buttons[0].highlight = True
  
	def draw(self, win):
		text_font = pg.font.Font(font, int(winHeight * 0.085))
		text = text_font.render("TOURNAMENT", True, (255, 255, 255))
		win.blit(text, [winWidth / 2 - (text.get_size()[0] / 2), winHeight * 0.1 - (text.get_size()[1] / 2)])
		for b in self.down_buttons:
			b.draw(win)
		text_font = pg.font.Font(font, int(winHeight * 0.06))
		text = text_font.render("MATCH SCORE = " + str(self.score), True, (255, 255, 255))
		win.blit(text, [winWidth / 4 - (text.get_size()[0] / 2), (winHeight / 3 * 2) - (text.get_size()[1] / 2)])
		text = text_font.render("PLAYERS = " + str(self.nb_players), True, (255, 255, 255))
		win.blit(text, [winWidth / 2 - (text.get_size()[0] / 2), (winHeight / 3 * 2) - (text.get_size()[1] / 2)])
		text = text_font.render("AI = " + str(self.ai_nb), True, (255, 255, 255))
		win.blit(text, [(winWidth / 4 * 3) - (text.get_size()[0] / 2), (winHeight / 3 * 2) - (text.get_size()[1] / 2)])
		for b in self.mod_buttons:
			b.draw(win)
		for b in self.param_buttons:
			b.draw(win)

	async def click(self, core, mousePos):
		for b in self.down_buttons:
			if b.hitbox.collidepoint(mousePos):
				if b.name == "BACK TO MENU":
					core.state = "menu"
					core.mode = "none"
					core.max_score = 10
					core.tournament_menu = False
				elif b.name == "START":
					await self.start(core)
				break

		for b in self.mod_buttons:
			if b.hitbox.collidepoint(mousePos):
				if (b.name == "LOCAL" and not b.highlight):
					self.mod_buttons[1].highlight = False
				elif (b.name == "ONLINE" and not b.highlight):
					self.mod_buttons[0].highlight = False
				b.highlight = not b.highlight
				break

		for b in self.param_buttons:
			if b.hitbox.collidepoint(mousePos):
				if b == self.param_buttons[0] or b == self.param_buttons[1]:
					if b.name == '-' and self.score > 1:
						self.score -= 1
					elif b.name == '+':
						self.score += 1
				elif b == self.param_buttons[2] or b == self.param_buttons[3]:
					if b.name == '-' and self.nb_players > 2:
						self.nb_players -= 1
						if self.ai_nb > self.nb_players:
							self.ai_nb = self.nb_players
					elif b.name == '+':
						self.nb_players += 1
					self.max_ai = self.nb_players
				else:
					if b.name == '-' and self.ai_nb > 0:
						self.ai_nb -= 1
					elif b.name == '+' and self.ai_nb < self.max_ai:
						self.ai_nb += 1
				break

		if self.ai_nb >= self.nb_players - 1:
			self.mod_buttons[1].highlight = False
			self.mod_buttons[0].highlight = True
   
	async def start(self, core):
		if not self.validStart():
			return
		self.getMods(core.alias)
		core.max_score = self.score
		core.tournament = Tournament(self.mod_list, self.nb_players, self.ai_nb, self.score, core.online, Player(1, core.alias, 2, "BORDERLESS" in self.mod_list, False))
		core.tournament_id = 1
		if "LOCAL" in self.mod_list:
			self.initPlayers(core)
			self.initWalls(core)
			core.ball = Ball("BORDERLESS" in self.mod_list)
			core.state = "tournament names"
			core.mode = "LOCAL"
			if "OBSTACLE" in self.mod_list:
				core.obstacle = Obstacle()
			msg = {"type" : 'tournament', 'online' : 'false'}
			core.GameHub.send(json.dumps(msg))
			core.tournament_names = TournamentNames(core.players)
		elif "ONLINE" in self.mod_list:
			msg = {"type" : 'tournament', 'online' : 'true', 'mods' : self.mod_list, 'score' : self.score, 'ai' : self.ai_nb, 'players' : self.players.__len__()}
			core.players = [Player(1, core.alias, 2, "BORDERLESS" in self.mod_list, False)]
			core.GameHub.send(json.dumps(msg))
			response : dict = json.loads(await core.GameHub.recv())
			core.GamePort = response['port']
			core.mode = "ONLINE"
			core.state = "tournament"
			core.id = response['pos']
			core.tournament_id = core.id
			core.online = True
			core.tournament.id = response['ID']

		core.start_screen = StartScreen(core.mode, core.online)

	def getMods(self, alias = "Player"):
		self.mod_list = []
		for b in self.mod_buttons:
			if b.highlight:
				self.mod_list.append(b.name)
		self.players = {}
		for i in range(self.nb_players):
			self.players[i + 1] = alias + str(i + 1) if self.ai_nb < self.nb_players - i else "AI"
   
	def initPlayers(self, core):
		core.players = []
		for key, name in self.players.items():
			core.players.append(Player(key, name, self.players.__len__(), "BORDERLESS" in self.mod_list, False))

	def initWalls(self, core):
		if ("BORDERLESS" in self.mod_list):
			core.walls = False
		else:
			core.walls = [Wall("up", False), Wall("down", False)]

	def validStart(self):
		for b in self.mod_buttons:
			if b.highlight and (b.name == "LOCAl" or b.name == "ONLINE"):
				return True
		return False