import sys
import asyncio
import websockets
import signal
import os

from config import *
from Player import *
from Wall import *
from Ball import *
from update import *
from Obstacle import *

class Game:
	def __init__(self):
		self.winSize = [winWidth, winHeight]
		self.last = time.time()
		self.state = "wait"
		self.clients = set()
		self.is_running = True
		self.start = [4, time.time()]
		self.hub = False
		self.id = 0
  
		self.ai = []

		self.obstacle = False
		self.custom_mod = False

    
	def initQuickGame(self):
		self.requiered = 2
		self.ball = Ball(False)
		self.players = [Player(1, "Player1", 2, False, False), Player(2, "Player2", 2, False, False)]
		self.max_score = 10
		self.walls = [Wall("up", False), Wall("down", False)]
    
	def initCustom(self, msg : dict):
		self.requiered = msg['players']
		self.ball = Ball(True if "BORDERLESS" in msg['mods'] else False)
		self.players = []
		for i in range(msg['players']):
			self.players.append(Player(i + 1, "Player{}".format(i + 1) if msg['ai'] < msg['players'] - i else 'AI', msg['players'], True if "BORDERLESS" in msg['mods'] else False, True if "1V1V1V1" in msg['mods'] else False))
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

    
	def endMsg(self, id, reason = 'end'): #add reason for leaving the game ??
		msg = {'type' : 'endGame'}
		if id != 0:
			for player in self.players:
				player.win = 'LOSE' if player.side == self.players[id - 1].side else 'WIN'
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
		for client in self.clients:
			await client.send(json.dumps(msg))
	
	async def sendHub(self, msg : dict):
		for hub in self.hub:
			await hub.send(json.dumps(msg))
 
	async def closeAll(self):
		for client in self.clients:
			await client.close()
		await self.hub.close()
 
	async def sendUpdate(self):
		if not self.is_running:
			return
		if self.state == "start":
			msg = {'type' : 'update', 'timer' : self.start[0]}
		else:
			msg = {'type' : 'update',
					'players' : [[player.paddle[0].pos.x, player.paddle[0].pos.y] for player in self.players],
					'ball' : [self.ball.center[0].x, self.ball.center[0].y, self.ball.stick, self.ball.speed, self.ball.dir],
					'score' : [player.score for player in self.players]}
			if self.obstacle:
				msg['obstacle'] = self.obstacle.solid
		await self.sendAll(msg)
 
	async def join(self, websocket, name = "Player"):
		self.clients.add(websocket)
		self.players[self.clients.__len__() - 1].name = name
		if self.clients.__len__() + self.ai.__len__() == self.requiered:
			for i, client in enumerate(self.clients):
				await client.send(json.dumps(self.startMsg(i + 1)))
			await self.sendAll({'type' : 'waiting'})
			self.state = 'ready'

			
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
	game.state = "start"
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

	finally:
		game.is_running = False
		clients.remove(websocket)
		if clients.__len__() <= 0:
			os.kill(os.getpid(), signal.SIGTERM)

 
async def parse_msg(msg : dict, websocket):
	global game
	if msg['type'] == 'create':
		if game.hub:
			game.hub.add(websocket)
		else:
			game.hub = set()
			game.hub.add(websocket)	
			if msg['cmd'] == 'quickGame':
				game.id = msg['Room_id']
				game.initQuickGame()
				await websocket.send(json.dumps({'type' : 'CreationSuccess'}))
			if msg['cmd'] == 'custom':
				game.id = msg['Room_id']
				game.initCustom(msg)
				await websocket.send(json.dumps({'type' : 'CreationSuccess'}))

	if msg['type'] == 'join':
		await game.join(websocket, msg['name'])

	if msg['type'] == 'input' and game.state == 'game':
		game.input(msg['player'], msg['inputs'])

	if msg['type'] == 'quitGame':
		if 'cmd' in msg.keys() and msg['cmd'] == 'quitWait':
			await game.hub.send(json.dumps({'type' : 'endGame', 'cmd' : 'quitWait', 'nb' : game.clients.__len__(), 'id' : msg['id']}))
			await game.sendAll({'type' : 'endGame', 'cmd' : 'quitWait', 'id': msg['id']})
			await websocket.close()
			game.clients.remove(websocket)
			if game.clients.__len__() == 0:
				game.is_running = False
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
	if args.__len__() != 3:
		return
	loop = asyncio.get_running_loop()
	stop = loop.create_future()
	loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

	async with websockets.serve(handle_game, args[1], args[2]):
		await stop
	print("Game room {} closed.".format(game.id))

asyncio.run(main())
