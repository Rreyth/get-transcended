from Player import *
from Obstacle import *
from Ball import *
from AI import *

class Tournament :
	def __init__(self, mods, nb_players, nb_ai, score):
		self.mods = mods
		self.max_players = nb_players
		self.nb_ai = nb_ai
		self.max_score = score
		self.timer = [5, time.time()]
		self.state = 'waiting'
		self.nb_match = nb_players - 1
  
	async def initPlayers(self, players):
		self.players = {}
		for player in players:
			self.players[player] = "(SPEC)"
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
		# if core: #TMPPP #endMsg with only winner infos ?
			# msg = {"type" : "endGame", "winner" : winner, "players" : self.max_players}
			# core.sendHub(msg)
   
	async def endMatch(self, players, core, reason = "end"):
		self.nb_match -= 1
		for player in players:
			for p in self.players.keys():
				if p.nb == player.tournament:
					if player.win == "LOSE" and reason != "leave":
						self.players[p] = "(LOSE)"
					elif self.players[p] != "(LEFT)":
						self.players[p] = "(SPEC)"
					break
 
		self.match_index += 1
		self.oddPlayersMatch()
 
		self.timer[0] = 5
		self.state = "interlude"
		core.state = "tournament"
		await core.sendAll(self.stateMsg('EndMatch'))
  
	def oddPlayersMatch(self):
		if self.match_index in self.matches and self.matches[self.match_index].__len__() == 1:
			for player in self.matches[self.match_index - 1]:
				for p, state in self.players.items():
					if p.nb == player.nb:
						if state == "(SPEC)":
							self.matches[self.match_index].append(player)
						break

	async def startMatch(self, core):
		core.start[0] = 4
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

		if "OBSTACLE" in self.mods:
			core.obstacle = Obstacle()
		core.ball = Ball("BORDERLESS" in self.mods)
		core.state = "start"
		await core.sendAll(self.stateMsg('StartMatch'))
  
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
				await self.startMatch(core)
	
	def updateMsg(self):
		matches = {}
		for id, players in self.matches.items():
			matches[id] = []
			for player in players:
				matches[id].append(player.nb)
		msg = {'type' : 'update',
			'tournament' : True,
			'state' : self.state,
			'timer' : self.timer[0],
			'matches' : matches,
			'index' : self.match_index}
		return msg

	def stateMsg(self, cmd):
		states = {}
		for player, state in self.players.items():
			states[player.nb] = state		
		msg = {'type' : 'update',
			'tournament' : True,
			'cmd' : cmd,
			'states' : states}
		return msg

	def leave(self, id):
		for player in self.players.keys():
			if player.nb == id:
				self.players[player] = "(LEFT)"
				break