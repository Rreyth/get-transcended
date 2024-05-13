from Player import *
from Obstacle import *
from Ball import *
from AI import *

class Tournament :
	def __init__(self, mods, nb_players, nb_ai, score):
		self.mods = mods
		self.max_players = nb_players #useless ?
		self.nb_ai = nb_ai
		self.max_score = score
		self.timer = [5, time.time()]
		self.state = 'waiting'
		self.nb_match = nb_players - 1
  
	def initPlayers(self, players):
		self.players = {}
		for player in players:
			self.players[player] = "(SPEC)"
		self.initMatches()
   
	def initMatches(self, core = False):
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
			self.endTournament(core)
   
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
			if match != self.matches[self.match_index]:
				break

	def endTournament(self, core):  #send msg ?
		for player, state in self.players.items():
			if state != "(LOSE)" and state != "(LEFT)":
				self.players[player] = "(WIN)"
				winner = player.nb
				break
		self.state = "end"
		if core: #TMPPP #endMsg with only winner infos ?
			msg = {"type" : "endGame", "winner" : winner, "players" : self.max_players}
			core.sendHub(msg)
   
	def endMatch(self, players): #send msg ?
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
		if self.match_index in self.matches and self.matches[self.match_index].__len__() == 1:
			for player in self.matches[self.match_index - 1]:
				for p, state in self.players.items():
					if p.nb == player.nb:
						if state == "(SPEC)":
							self.matches[self.match_index].append(player)
						break
  
		self.state = "interlude"


	def startMatch(self, core): #send msg ?
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
  
	def update(self, core):
		if self.state == "interlude":
			self.checkMatch()
			if self.match_index not in self.matches:
				self.initMatches(core)
			tmp = time.time()
			if (tmp - self.timer[1] >= 1):
				self.timer[0] -= 1
				self.timer[1] = tmp
			if self.timer[0] <= 0:
				self.startMatch(core)
	
	def updateMsg(self):
		matches = {}
		for id, players in self.matches.items():
			matches[id] = [players[0].nb, players[1].nb]
		msg = {'type' : 'update',
			'tournament' : True,
			'state' : self.state,
			'timer' : self.timer[0],
			'matches' : matches,
			'index' : self.match_index}
		return msg