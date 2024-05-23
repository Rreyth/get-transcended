from .config import *
from .Button import *
from .Arrow import *
from .Vec2 import *
from .Hitbox import *
from .StartScreen import *
from .Player import *
from .Obstacle import *
from .Ball import *
from .AI import *
from .Wall import *

class Tournament:
	def __init__(self, mods, nb_players, nb_ai, max_score, online, creator):
		self.id = 1234
		self.button = Button("LEAVE", winWidth * 0.015, winHeight * 0.9, winWidth * 0.11, winHeight * 0.07, winHeight * 0.06)
		self.size = [winWidth * 0.2, winHeight * 0.4]
		self.visual = [Button("", -(winWidth * 0.05), winHeight / 2 - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085, True)]
		self.size[1] = winHeight * 0.4 * nb_players if nb_players <= 20 else winHeight * 0.4 * 20
		self.visual.append(Button("", winWidth * 0.85, winHeight / 2 - (self.size[1] / 2), self.size[0], self.size[1], winHeight * 0.085, True))
		self.start_names = self.visual[1].y + (winHeight * 0.025)
		spec_size = [winWidth * 0.65, winHeight * 0.65]
		self.spec_screen = Button("", (winWidth / 2) - (spec_size[0] / 2), (winHeight / 2) - (spec_size[1] / 2), spec_size[0], spec_size[1], winHeight * 0.085, True)
		self.init_pos = self.start_names
		self.nb_ai = nb_ai
		self.max_players = nb_players
		self.max_score = max_score
		self.mods = mods
		self.online = online
		self.state = "waiting"
		self.timer = [5, time.time()]
		if nb_players > 20:
			self.arrows = [Arrow("", winWidth * 0.977, winHeight / 2 - (self.size[1] * 0.49), winWidth * 0.02, winHeight * 0.02, "up"),
                  			Arrow("", winWidth * 0.977, winHeight / 2 + (self.size[1] * 0.465), winWidth * 0.02, winHeight * 0.02, "down")]
		self.nb_match = nb_players - 1
		self.players = {}
		if creator:
			self.players[creator] = "(SPEC)"
   
	async def initPlayers(self, players):
		self.players = {}
		for player in players:
			self.players[player] = "(SPEC)"
		if (self.players.__len__() == self.max_players):
			await self.initMatches()
   
	async def initMatches(self, core = False):
		index = 1
		self.matches = {}
		self.matches[index] = []
		for player, state in self.players.items():
			if state != "(LOSE)" and state != "(LEFT)":
				if self.matches[index].__len__() == 2:
					index += 1
					self.matches[index] = []
				self.matches[index].append(player)
		self.match_index = 1
		self.state = "interlude"
		self.timer = [5, time.time()]
		if index == 1 and self.matches[index].__len__() == 1:
			await self.endTournament(core)
   
	def checkMatch(self):
		if self.match_index not in self.matches:
			return
		match = self.matches[self.match_index]
		for p in match:
			for player, state in self.players.items():
				if p.nb == player.nb and state == "(LEFT)":
					self.match_index += 1
					self.timer = [5, time.time()]
					break
			if self.match_index not in self.matches or match != self.matches[self.match_index]:
				break
		self.oddPlayersMatch()
  
	async def endTournament(self, core):
		for player, state in self.players.items():
			if state != "(LOSE)" and state != "(LEFT)":
				self.players[player] = "(WIN)"
				winner = player.nb
				break
		self.state = "end"
		await core.sendAll(self.stateMsg("EndTournament"))
		if core: 
			msg = {"type" : "endGame", "winner" : winner, "players" : self.max_players}
			await core.GameHub.send(json.dumps(msg))
   
	def endMatch(self, players):
		self.nb_match -= 1
		for player in players:
			for p in self.players.keys():
				if p.nb == player.tournament:
					if player.win == "LOSE":
						self.players[p] = "(LOSE)"
					else:
						self.players[p] = "(SPEC)"
					break
 
		self.match_index += 1
		self.oddPlayersMatch()
		self.state = "interlude"
  
	def oddPlayersMatch(self):
		if self.match_index in self.matches and self.matches[self.match_index].__len__() == 1:
			for player in self.matches[self.match_index - 1]:
				for p, state in self.players.items():
					if p.nb == player.nb:
						if state == "(SPEC)":
							self.matches[self.match_index].append(player)
						break
  
	def startMatch(self, core):
		self.timer[0] = 5
		self.state = "ongoing"
		core.players = []
		core.ai = []
		for i, player in enumerate(self.matches[self.match_index]):
			for p in self.players.keys():
				if p.nb == player.nb:
					self.players[p] = "(PLAY)"
					break
			core.players.append(Player(i + 1, player.name, 2, "BORDERLESS" in self.mods, False))
			core.players[i].tournament = player.nb
			if player.name == "AI":
				core.ai.append(AI(core.players[i]))

		core.start_screen = StartScreen("ONLINE" if self.online else "LOCAL", core.online)
		if "OBSTACLE" in self.mods:
			core.obstacle = Obstacle()
		core.ball = Ball("BORDERLESS" in self.mods)
		core.state = "start"
  
	async def update(self, core):
		if self.state == "interlude":
			self.checkMatch()
			if self.match_index not in self.matches:
				await self.initMatches(core)
			tmp = time.time()
			if (tmp - self.timer[1] >= 1):
				self.timer[0] -= 1
				self.timer[1] = tmp
			if self.timer[0] <= 0:
				self.startMatch(core)
	
	async def onlineUpdate(self, msg : dict, core):
		if 'cmd' in msg.keys():
			if msg['cmd'] == 'StartMatch':
				self.onlineStart(msg['states'], core)
			elif msg["cmd"] == 'EndMatch' or msg["cmd"] == 'EndTournament':
				await self.onlineEnd(msg, core)
			elif msg["cmd"] == 'leave':
				self.leave(msg['id'])
			return
		for id, players in msg['matches'].items():
			self.matches[id] = []
			i = 0
			while i < 2 and msg['index'] == id:
				for p in self.players.keys():
					if p.nb == players[i]:
						self.matches[id].append(p)
						i += 1
					if self.matches[id].__len__() == 2:
						break
  
		self.state = msg['state']
		self.timer[0] = msg['timer']
		self.match_index = msg["index"]
  
	def leave(self, id):
		for player in self.players.keys():
			if player.nb == id:
				self.players[player] = "(LEFT)"
				break

	def onlineStart(self, states, core):
		for p in self.players.keys():
			self.players[p] = states[p.nb]
		self.state = 'ongoing'
		core.players = []
		core.ai = []
		for i, player in enumerate(self.matches[self.match_index]):
			core.players.append(Player(i + 1, player.name, 2, "BORDERLESS" in self.mods, False))
			core.players[i].tournament = player.nb
		core.walls = False
		if ("BORDERLESS" not in self.mods):
			core.walls = [Wall('up', False), Wall('down', False)]
		if "OBSTACLE" in self.mods:
			core.obstacle = Obstacle()
		core.ball = Ball("BORDERLESS" in self.mods)
		for player in core.players:
			if core.tournament_id == player.tournament:
				core.state = "start"
				core.id = player.nb
				core.start_screen = StartScreen("ONLINE", core.online)
				break
		if core.state == 'tournament':
			self.resizeSpec(core)
   
	def resizeSpec(self, core):
		spec_size = [self.spec_screen.width, self.spec_screen.height]
		spec_pos = [self.spec_screen.x, self.spec_screen.y]
		for player in core.players:
			player.size = [spec_size[0] * 0.007, spec_size * 0.1]
			player.paddle[0].size = player.size
			new_pos = [((player.paddle[0].pos.x / winWidth) * spec_size[0]) + spec_pos[0],
						((player.paddle[0].pos.y / winHeight) * spec_size[1]) + spec_pos[1]]
			player.paddle[0].pos = Vec2(new_pos[0], new_pos[1])
			if player.borderless:
				player.paddle[1].size = player.size
				player.paddle[1].pos = Vec2(new_pos[0], new_pos[1] - spec_size[1])
				player.paddle[2].size = player.size
				player.paddle[2].pos = Vec2(new_pos[0], new_pos[1] + spec_size[1])
    
		if core.walls:
			for wall in core.walls:
				if wall.spec:
					continue
				wall.spec = True
				wall.size = [spec_size[0], spec_size[1] * 0.0075]
				new_pos = [((wall.visual.x / winWidth) * spec_size[0]) + spec_pos[0],
							((wall.visual.y / winHeight) * spec_size[1]) + spec_pos[1]]
				wall.visual = Vec2(new_pos[0], new_pos[1])
				wall.hitbox = Hitbox(new_pos[0], new_pos[1], wall.size[0], wall.size[1])
		
		core.ball.radius = int(spec_size[1] * 0.01)
		new_pos = [((core.ball.center[0].x / winWidth) * spec_size[0]) + spec_pos[0],
					((core.ball.center[0].y / winHeight) * spec_size[1]) + spec_pos[1]]
		core.ball.center[0] = Vec2(new_pos[0], new_pos[1])
		if core.ball.borderless:
			core.ball.center[1] = Vec2(new_pos[0], new_pos[1] + spec_size[1])
			core.ball.center[2] = Vec2(new_pos[0], new_pos[1] - spec_size[1])
  
		if core.obstacle:
			core.obstacle.radius = int(spec_size[1] * 0.193)
   
	async def onlineEnd(self, msg : dict, core):
		for p in self.players.keys():
			self.players[p] = msg['states'][p.nb]
		if msg['cmd'] == "EndMatch":
			self.state = 'interlude'
			self.nb_match -= 1
		else:
			self.state = 'end'
			await core.GameRoom.close()
			core.GameRoom = False
		core.state = 'tournament'
		self.timer[0] = 5
  
	def draw(self, core, win):
		self.centerBox(core, win)
		text_font = pg.font.Font(font, int(winHeight * 0.085))
		if self.online:
			text = text_font.render("ID : " + str(self.id), True, (255, 255, 255))
			win.blit(text, [winWidth * 0.06 - (text.get_size[0] / 2), winHeight * 0.1 - (text.get_size[1] / 2)])
		text_font = pg.font.Font(font, int(winHeight * 0.15))
		text = text_font.render("TOURNAMENT", True, (255, 255, 255))
		win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.1 - (text.get_size[1] / 2)])
		text_font = pg.font.Font(font, int(winHeight * 0.06))
		if self.state == 'ongoing':
			match = self.matches[self.match_index]
			text = text_font.render("SPECTATING", True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.87 - (text.get_size[1] / 2)])
			text = text_font.render(match[0].name, True, (255, 255, 255))
			win.blit(text, [self.spec_screen.x, winHeight * 0.94 - (text.get_size[1] / 2)])
			text = text_font.render(match[1].name, True, (255, 255, 255))
			win.blit(text, [self.spec_screen.x + self.spec_screen.width - text.get_size[0], winHeight * 0.94 - (text.get_size[1] / 2)])
			text = text_font.render("VS", True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.94 - (text.get_size[1] / 2)])
   
		self.button.draw(win)
		self.leftBox(win)
		self.rightBox(win)		
		for b in self.visual:
			b.draw(win)
		if self.arrows:
			for arrow in self.arrows:
				arrow.draw(win)
    
	def centerBox(self, core, win):
		text_font = pg.font.Font(font, int(winHeight * 0.085))
		self.spec_screen.draw(win)
		if self.state == "waiting":
			text = text_font.render("WAITING FOR PLAYERS", True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.45 - (text.get_size[1] / 2)])
			text = text_font.render(str(self.players.__len__()) + "/" + str(self.max_players), True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.55 - (text.get_size[1] / 2)])
		elif self.state == 'interlude':
			text = text_font.render("NEXT MATCH", True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.4 - (text.get_size[1] / 2)])
			names = self.matches[self.match_index][0].name + "   -   " + self.matches[self.match_index][1].name
			text = text_font.render(names, True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.5 - (text.get_size[1] / 2)])
			text = text_font.render(str(self.timer[0]), True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.6 - (text.get_size[1] / 2)])
		elif self.state == 'ongoing':
			self.specDraw(core, win)
		elif self.state == 'end':
			text = text_font.render("WINNER", True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.4 - (text.get_size[1] / 2)])
			for player, state in self.players.items():
				if state == "(WIN)":
					text = text_font.render(player.name, True, (255, 255, 255))
					win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.6 - (text.get_size[1] / 2)])
					break
		pg.draw.rect(win, (0, 0, 0), pg.Rect((0, 0), (winWidth, self.spec_screen.y * 0.995)))
		pg.draw.rect(win, (0, 0, 0), pg.Rect((0, self.spec_screen.y + (self.spec_screen.height * 1.001)), (winWidth, self.spec_screen.y)))

	def specDraw(self, core, win):
		text_font = pg.font.Font(font, int(self.spec_screen.height * 0.75))
		text = text_font.render(str(core.players[0].score), True, (100, 100, 100))
		surface = pg.Surface(text.get_size(), pg.SRCALPHA)
		surface.blit(text, (0, 0))
		surface.set_alpha(128)
		win.blit(surface, [winWidth * 0.3 - (text.get_size[0] / 2), winHeight * 0.56 - (text.get_size[1] / 2)])
		text = text_font.render("-", True, (100, 100, 100))
		surface = pg.Surface(text.get_size(), pg.SRCALPHA)
		surface.blit(text, (0, 0))
		surface.set_alpha(128)
		win.blit(surface, [winWidth / 2 - (text.get_size[0] / 2), winHeight * 0.56 - (text.get_size[1] / 2)])
		text = text_font.render(str(core.players[1].score), True, (100, 100, 100))
		surface = pg.Surface(text.get_size(), pg.SRCALPHA)
		surface.blit(text, (0, 0))
		surface.set_alpha(128)
		win.blit(surface, [winWidth * 0.7 - (text.get_size[0] / 2), winHeight * 0.56 - (text.get_size[1] / 2)])
		text_font = pg.font.Font(font, int(winHeight * 0.085))
		for player in core.players:
			player.draw(win)
		if core.walls:
			for wall in core.walls:
				wall.draw(win)
		if core.obstacle:
			core.obstacle.draw(win)
		core.ball.draw(win)
  
		if self.timer[0] > 0:
			surface = pg.Surface((self.spec_screen.width, self.spec_screen.height), pg.SRCALPHA)
			surface.fill((0, 0, 0, 125))
			win.blit(surface, (self.spec_screen.x, self.spec_screen.y))
			text = text_font.render(str(self.timer[0]), True, (255, 255, 255))
			win.blit(text, [winWidth / 2 - (text.get_size[0] / 2), winHeight / 2 - (text.get_size[1] / 2)])
			
	def rightBox(self, win):
		text_font = pg.font.Font(font, int(winHeight * 0.04))
		gap = winHeight * 0.04
		pos = self.start_names
		for player, state in self.players.items():
			name = player.name if player.name.__len__() <= 9 else player.name[:9] + '.'
			text = text_font.render(name, True, (255, 255, 255))
			win.blit(text, [winWidth * 0.86, pos - (text.get_size[1] / 2)])
			text = text_font.render(state, True, (255, 255, 255))
			win.blit(text, [winWidth * 0.93, pos - (text.get_size[1] / 2)])
			pos += gap
		pg.draw.rect(win, (0, 0, 0), pg.Rect((self.visual[1].x, 0), (self.visual[1].width, self.visual[1].y)))
		pg.draw.rect(win, (0, 0, 0), pg.Rect((self.visual[1].x, self.visual[1].y + self.size[1]), (self.visual[1].width, self.visual[1].y)))
		
	def leftBox(self, win):
		text_font = pg.font.Font(font, int(winHeight * 0.05))
		text = text_font.render("ONLINE" if self.online else "LOCAL", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.35 - (text.get_size[1] / 2)])
		text = text_font.render("PLAYERS:", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.4 - (text.get_size[1] / 2)])
		text = text_font.render("AI:", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.45 - (text.get_size[1] / 2)])
		text = text_font.render("BORDERLESS:", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.5 - (text.get_size[1] / 2)])
		text = text_font.render("OBSTACLE:", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.55 - (text.get_size[1] / 2)])
		text = text_font.render("MATCH SCORE:", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.6 - (text.get_size[1] / 2)])
		text = text_font.render("MATCH LEFT:", True, (255, 255, 255))
		win.blit(text, [winWidth * 0.005, winHeight * 0.65 - (text.get_size[1] / 2)])
		text = text_font.render(str(self.max_players), True, (255, 255, 255))
		win.blit(text, [winWidth * 0.12 - (text.get_size[0] / 2), winHeight * 0.4 - (text.get_size[1] / 2)])
		text = text_font.render(str(self.nb_ai), True, (255, 255, 255))
		win.blit(text, [winWidth * 0.12 - (text.get_size[0] / 2), winHeight * 0.45 - (text.get_size[1] / 2)])
		text = text_font.render(str("BORDERLESS" in self.mods), True, (255, 255, 255))
		win.blit(text, [winWidth * 0.12 - (text.get_size[0] / 2), winHeight * 0.5 - (text.get_size[1] / 2)])
		text = text_font.render(str("OBSTACLE" in self.mods), True, (255, 255, 255))
		win.blit(text, [winWidth * 0.12 - (text.get_size[0] / 2), winHeight * 0.55 - (text.get_size[1] / 2)])
		text = text_font.render(str(self.max_score), True, (255, 255, 255))
		win.blit(text, [winWidth * 0.12 - (text.get_size[0] / 2), winHeight * 0.6 - (text.get_size[1] / 2)])
		text = text_font.render(str(self.nb_match), True, (255, 255, 255))
		win.blit(text, [winWidth * 0.12 - (text.get_size[0] / 2), winHeight * 0.65 - (text.get_size[1] / 2)])
  
	def scroll(self, dir):
		if self.players.__len__() <= 20:
			return
		last_pos = self.start_names + ((winHeight * 0.04) * (self.players.__len__() - 1))
		if dir == 'up' and self.start_names < self.init_pos:
			self.start_names += winHeight * 0.02
		elif dir == 'down' and last_pos > (self.visual[1].y + self.size[1]):
			self.start_names -= winHeight * 0.02
   
	async def click(self, core, mousePos):
		if self.arrows:
			for arrow in self.arrows:
				if arrow.hitbox.collidepoint(mousePos):
					self.scroll(arrow.dir)
					return

		if self.button.hitbox.collidepoint(mousePos):
			core.state = "menu"
			core.mode = "none"
			core.max_score = 10
			core.online = False
			core.tournament_menu = False
			core.tournament = False
			if core.GameRoom:
				await core.GameRoom.send(json.dumps({'type' : 'quitGame', 'id' : core.tournament_id, 'cmd' : 'tournament'}))
			else:
				await core.GameHub.send(json.dumps({'type' : 'quitGame', 'id' : core.tournament_id, 'cmd' : 'tournament'}))
    