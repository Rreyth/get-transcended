import sys
import asyncio
import websockets
import signal
import os
import ssl

from config import *
from Player import *
from Wall import *
from Ball import *
from update import *
from AI import *
from Obstacle import *
from Tournament import *

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain("/certs/cert.pem")

class Game:
	def __init__(self):
		self.winSize = [winWidth, winHeight]
		self.last = time.time()
		self.state = "wait"
		self.clients = {}
		self.is_running = True
		self.start = [4, time.time()]
		self.hub = False
		self.id = 0
  
		self.ai = []

		self.obstacle = False
		self.custom_mod = False
		self.tournament = False

    
	def initQuickGame(self):
		self.requiered = 2
		self.ball = Ball(False)
		self.players = [Player(1, "Player1", 2, False, False), Player(2, "Player2", 2, False, False)]
		self.max_score = 10
		self.walls = [Wall("up", False), Wall("down", False)]
    
	def initCustom(self, msg : dict):
		self.requiered = msg['players']
		self.ball = Ball("BORDERLESS" in msg['mods'])
		self.players = []
		for i in range(msg['players']):
			self.players.append(Player(i + 1, "Player{}".format(i + 1) if msg['ai'] < msg['players'] - i else 'AI', msg['players'], "BORDERLESS" in msg['mods'], "1V1V1V1" in msg['mods']))
		for player in self.players:
			if player.name == 'AI':
				self.ai.append(AI(player))

		self.max_score = msg['score']
		if "OBSTACLE" in msg['mods']:
			self.obstacle = Obstacle()
		self.walls = False
		if "1V1V1V1" in msg['mods']:
			self.custom_mod = "1V1V1V1"
			self.walls = [Wall("up", True), Wall("down", True), Wall("left", True), Wall("right", True)]
		elif "BORDERLESS" not in msg['mods']:
			self.walls = [Wall("up", False), Wall("down", False)]


	def initTournament(self, msg : dict):
		self.requiered = msg['players']
		self.ball = Ball("BORDERLESS" in msg['mods'])
		self.players = []
		for i in range(msg['players']):
			self.players.append(Player(i + 1, "Player{}".format(i + 1) if msg['ai'] < msg['players'] - i else 'AI', msg['players'], "BORDERLESS" in msg['mods'], False))

		self.max_score = msg['score']
		self.walls = False
		if "BORDERLESS" not in msg['mods']:
			self.walls = [Wall("up", False), Wall("down", False)]
		self.tournament = Tournament(msg['mods'], msg['players'], msg['ai'], msg['score'])

    
	def endMsg(self, id, reason = 'end'):
		msg = {'type' : 'endGame'}
		if id != 0:
			for player in self.players:
				player.win = 'LOSE' if player.side == self.players[id - 1].side else 'WIN'
		msg['players'] = [player.name for player in self.players]
		msg['score'] = [player.score for player in self.players]
		msg['win'] = [player.win for player in self.players]
		msg['reason'] = reason
		return msg
 
	def startMsg(self, id):
		msg = {'type' : 'start', 'id' : id,
				'Room_id' : self.id,
				'players' : [[player.nb, player.name, player.nb_total, player.borderless, player.square] for player in game.players],
				'walls' : [[wall.pos, wall.square] for wall in self.walls] if self.walls else [],
				'ball' : self.ball.borderless}
		if self.obstacle:
			msg['obstacle'] = self.obstacle.solid
		return msg
 
	async def sendAll(self, msg : dict):
		for client in self.clients.values():
			await client.send(json.dumps(msg))
	
	async def sendHub(self, msg : dict):
		for hub in self.hub:
			await hub.send(json.dumps(msg))
 
	async def closeAll(self):
		for client in self.clients.values():
			await client.close()
		for hub in self.hub:
			await hub.close()
 
	async def sendUpdate(self):
		if not self.is_running:
			return
		if self.state == "tournament":
			msg = self.tournament.updateMsg()
		elif self.state == "start":
			msg = {'type' : 'update', 'timer' : self.start[0]}
		else:
			msg = {'type' : 'update',
					'players' : [[player.paddle[0].pos.x / winWidth, player.paddle[0].pos.y / winHeight] for player in self.players],
					'ball' : [self.ball.center[0].x / winWidth, self.ball.center[0].y / winHeight, self.ball.stick, self.ball.speed, self.ball.dir],
					'score' : [player.score for player in self.players]}
			if self.obstacle:
				msg['obstacle'] = self.obstacle.solid
		await self.sendAll(msg)
 
	async def join(self, websocket, name = "Player"):
		# self.clients.add(websocket)
		self.clients[self.clients.__len__() + 1] = websocket
		self.players[self.clients.__len__() - 1].name = name
		if self.clients.__len__() + self.ai.__len__() == self.requiered:
			for i, client in enumerate(self.clients.values()):
				await client.send(json.dumps(self.startMsg(i + 1)))
			await self.sendAll({'type' : 'waiting'})
			self.state = 'ready'
			if self.tournament:
				await self.tournament.initPlayers(self.players)

			
	def input(self, player_id, inputs):
		for input in inputs:
			if input == "UP":
				self.players[player_id - 1].moveUp(self.walls)
			elif input == "DOWN":
				self.players[player_id - 1].moveDown(self.walls)
			elif input == "LEFT":
				self.players[player_id - 1].moveLeft(self.walls)
			elif input == "RIGHT":
				self.players[player_id - 1].moveRight(self.walls)
			elif input == "LAUNCH" and self.ball.stick == player_id:
				self.ball.launch()

	def ai_moves(self):
		for ai in self.ai:
			for move in ai.moves:
				if move == "UP":
					self.players[ai.id - 1].moveUp(self.walls)
				elif move == "DOWN":
					self.players[ai.id - 1].moveDown(self.walls)
				elif move == "LEFT":
					self.players[ai.id - 1].moveLeft(self.walls)
				elif move == "RIGHT":
					self.players[ai.id - 1].moveRight(self.walls)
				elif move == "LAUNCH" and self.ball.stick == ai.id:
					self.ball.launch()
			ai.pos = Vec2(pos=self.players[ai.id - 1].paddle[0].pos)
			ai.moves = []

		
	async def tick(self):
		tmp = time.time()
		delta = tmp - self.last
		self.last = tmp

		await update_all(self, delta)
		
	def quit(self):
		self.is_running = False


async def run_game():
	global game
	game.state = "tournament" if game.tournament else "start"
	while game.is_running:
		await game.tick()
		if not game.is_running:
			break
		game.ai_moves()
		if not game.is_running:
			break
		await game.sendUpdate()
		await asyncio.sleep(0.01)


async def handle_game(websocket, path):
	global clients
	global game
	clients.add(websocket)

	try:
		async for message in websocket:
			await parse_msg(json.loads(message), websocket)
			if game.state == 'ready':
				await game.sendAll({'type' : 'start'})
				asyncio.create_task(run_game())

	except websockets.exceptions.ConnectionClosedError:
		for key, ws in game.clients.items():
			if ws == websocket:
				print(f"Game room: Client {key}: Connection Closed Error", file=sys.stderr)
				break
	except websockets.exceptions.ConnectionClosedOK:
		for key, ws in game.clients.items():
			if ws == websocket:
				print(f"Game room: Client {key}: Closed connection", file=sys.stderr)
				break

	finally:
		if game.tournament:
			for key, value in game.clients.items():
				if value == websocket:
					del game.clients[key]
					await game.sendAll({'type' : 'update', 'tournament' : True, 'cmd' : 'leave', 'id' : key})
					game.tournament.leave(key)
					if game.state == "game" or game.state == "start":
						await game.tournament.endMatch(game.players, game, 'leave')
					break
			if game.clients.__len__() == 0:
				await game.closeAll()
				clients.clear()
		else:
			if game.state != 'end' and game.is_running:
				for key, value in game.clients.items():
					if value == websocket:
						del game.clients[key]
						await game.sendHub(json.dumps(game.endMsg(key, 'quit')))
						await game.sendAll(game.endMsg(key, 'quit'))
						break
			game.is_running = False
		clients.discard(websocket)
		if clients.__len__() == 0:
			os.kill(os.getpid(), signal.SIGTERM)

 
async def parse_msg(msg : dict, websocket):
	global game
	if msg['type'] == 'create':
		if game.hub:
			game.hub.add(websocket)
		else:
			game.hub = set()
			game.hub.add(websocket)	
			game.id = msg['Room_id']
			if msg['cmd'] == 'quickGame':
				game.initQuickGame()
				await websocket.send(json.dumps({'type' : 'CreationSuccess'}))
			if msg['cmd'] == 'custom':
				game.initCustom(msg)
				await websocket.send(json.dumps({'type' : 'CreationSuccess'}))
			if msg['cmd'] == 'tournament':
				game.initTournament(msg)
				await websocket.send(json.dumps({'type' : 'CreationSuccess'}))

	if msg['type'] == 'join':
		await game.join(websocket, msg['name'])

	if msg['type'] == 'input' and game.state == 'game':
		game.input(msg['player'], msg['inputs'])

	if msg['type'] == 'quitGame':
		if 'cmd' in msg.keys() and msg['cmd'] == 'quitWait':
			await game.hub.send(json.dumps({'type' : 'endGame', 'cmd' : 'quitWait', 'nb' : game.clients.__len__(), 'id' : msg['id']}))
			await game.sendAll({'type' : 'endGame', 'cmd' : 'quitWait', 'id': msg['id']})
			# game.clients.pop(msg['id'])
			for key, value in game.clients.items():
				if value == websocket:
					del game.clients[key]
					break
			await websocket.close()
			if game.clients.__len__() == 0:
				game.is_running = False
		elif 'cmd' in msg.keys() and msg['cmd'] == 'tournament':
			# game.clients.pop(msg['id'])
			for key, value in game.clients.items():
				if value == websocket:
					del game.clients[key]
					break
			await websocket.close()
			if game.clients.__len__() == 0:
				game.is_running = False
			else:
				await game.sendAll({'type' : 'update', 'tournament' : True, 'cmd' : 'leave', 'id' : msg['id']})
				game.tournament.leave(msg['id'])
		else:
			if game.tournament:
				# game.clients.pop(msg['id'])
				for key, value in game.clients.items():
					if value == websocket:
						del game.clients[key]
						break
				await websocket.close()
				if game.clients.__len__() == 0:
					game.is_running = False
				else:
					await game.sendAll({'type' : 'update', 'tournament' : True, 'cmd' : 'leave', 'id' : msg['id']})
					game.tournament.leave(msg['id'])
					await game.tournament.endMatch(game.players, game, 'leave')
			else:
				await game.sendHub(json.dumps(game.endMsg(msg['id'], 'quit')))
				await game.sendAll(game.endMsg(msg['id'], 'quit'))
				game.is_running = False
				await websocket.close()

	if msg['type'] == 'close':
		game.is_running = False
		await websocket.close()
	

game = Game()
args = sys.argv

clients = set()

async def main():
	global clients
	global game
	if args.__len__() != 4:
		return
	loop = asyncio.get_running_loop()
	stop = loop.create_future()
	loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

	game.id = args[3]
	async with websockets.serve(handle_game, args[1], args[2], ssl=ssl_context):
		await stop
	print("Game room {} closed.".format(game.id))

asyncio.run(main())
