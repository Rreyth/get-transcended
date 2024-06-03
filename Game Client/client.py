import asyncio
import websockets
import json
import signal
import ssl
import sys
from game.core import *

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

game = Game()

async def try_connect(websocket):
	global game
	username = input("USERNAME: ")
	password = input("PASSWORD: ")

	msg = {"type" : "connect", "cmd" : "username", "username" : username, "password" : password}
	await websocket.send(json.dumps(msg))
	response : dict = json.loads(await websocket.recv())
	if response["success"] == "true":
		print("Connection success")
		game.alias = username
	else:
		print(f"Connection failed: {response['error']}")
		exit(1)


async def parse_msg(msg : dict):
	global game
 
	if msg['type'] == 'join':
		if game.state == 'tournament':
			game.players.append(Player(game.players.__len__() + 1, msg['alias'], 2, False, False))
			await game.tournament.initPlayers(game.players)
		else:
			game.wait_screen.nb += 1
 
	if msg['type'] == 'start':
		game.state = 'tournament' if game.tournament else 'start'

	if msg['type'] == 'update':
		if 'tournament' in msg.keys():
			await game.tournament.onlineUpdate(msg, game)
		elif 'timer' in msg.keys():
			if game.state == 'tournament':
				game.tournament.timer[0] = msg['timer']
			else:
				game.start_screen.timer = msg['timer']
		else:
			if game.state != 'tournament':
				game.state = 'game'
			for i in range(game.players.__len__()):
				game.players[i].paddle[0].pos = Vec2(msg['players'][i][0] * winWidth, msg['players'][i][1] * winHeight)
				game.players[i].score = msg['score'][i]
			game.ball.center[0] = Vec2(msg['ball'][0] * winWidth, msg['ball'][1] * winHeight)
			game.ball.stick = msg['ball'][2]
			game.ball.speed = msg['ball'][3]
			game.ball.dir = msg['ball'][4]
			if game.obstacle:
				game.obstacle.solid = msg['obstacle']
			if game.state == 'tournament':
				game.tournament.timer[0] = 0
				game.tournament.resizeSpec(game)

	if msg['type'] == 'endGame':
		if 'cmd' in msg.keys() and msg['cmd'] == 'quitWait':
			if msg['id'] == game.id:
				game.state = 'menu' if game.state != 'quit'	else 'quit'
				game.is_running = False
				if game.GameRoom:
					await game.GameRoom.close()
					game.GameRoom = False
			else:
				if game.id > msg['id']:
					game.id -= 1
				if game.state != 'tournament':
					game.wait_screen.nb -= 1
				else:
					game.players = [player for player in game.players if player.nb != msg['id']]
					for player in game.players:
						if player.nb > msg['id']:
							player.nb -= 1
					await game.tournament.initPlayers(game.players)
			return
		for player in msg['match']:
			game.players[player['id'] - 1].win = "WIN" if player['win'] else "LOSE"
			game.players[player['id'] - 1].score = player['score']
		game.is_running = False
		if game.state != 'menu' and game.state != 'quit':
			game.state = 'end'
		if game.GameRoom:
			await game.GameRoom.close()
			game.GameRoom = False

async def run_game():
	global game
	while game.is_running:
		await game.input()
		if not game.is_running:
			break
		await game.tick()
		if not game.is_running:
			break
		game.render()
		if not game.is_running:
			break
		await asyncio.sleep(0.01)


async def local_run():
	global game
	while game.is_running and not game.online:
		await game.input()
		if not game.is_running and not game.online:
			break
		await game.tick()
		if not game.is_running and not game.online:
			break
		game.render()
		await asyncio.sleep(0.01)


async def wait_loop():
	global game
	game.render()
	msg = {'type' : 'none'}
	while game.is_running and msg['type'] != 'start':
		await parse_msg(msg)
		await game.input()
		if not game.is_running:
			break
		await game.tick()
		game.render()
		await asyncio.sleep(0.01)
		try:
			msg :dict = json.loads(await asyncio.wait_for(game.GameHub.recv(), timeout=0.01))
		except asyncio.TimeoutError:
			msg = {'type' : 'none'}
	if game.is_running:
		socket = "wss://" + ip + ":" + str(game.GamePort)
		game.GameRoom = await websockets.connect(socket, ssl=ssl_context)
		if game.tournament:
			await game.GameRoom.send(json.dumps({'type' : 'join', 'name' : game.alias, "tournament" : game.tournament_id}))
		else:	
			await game.GameRoom.send(json.dumps({'type' : 'join', 'name' : game.alias}))
		infos : dict = json.loads(await game.GameRoom.recv())
		while infos['type'] != 'start':
			infos : dict = json.loads(await game.GameRoom.recv())
		game.id = infos['id']
		game.players = []
		game.walls = []
		for player in infos['players']:
			game.players.append(Player(player[0], player[1], player[2], player[3], player[4]))
		for wall in infos['walls']:
			game.walls.append(Wall(wall[0], wall[1]))
		if game.walls.__len__() == 0:
			game.walls = False
		game.ball = Ball(infos['ball'])
		if 'obstacle' in infos.keys():
			game.obstacle = Obstacle()
		if game.state == 'tournament':
			await game.tournament.initPlayers(game.players)
			game.tournament_id = game.id
		game.state = 'launch'
	

async def in_game(websocket):
	global game
	game.start(websocket)
	await local_run()
	if game.is_running:
		await wait_loop()
	if game.online:
		try:
			if game.GameRoom:
				async for message in game.GameRoom:
					await parse_msg(json.loads(message))
					if game.state == 'launch':
						game.state = 'start'
						asyncio.create_task(run_game())

		finally:
			game.is_running = False
			if game.GameRoom:
				await game.GameRoom.close()
			if game.state == 'menu' or game.state == 'end' or game.state == 'tournament':
				await in_game(websocket)
			game.pygame_quit()


args = sys.argv
ip = "localhost" if args.__len__() != 2 else args[1]

async def main():
	global game
 
	async def sig_handler(sig, frame):
		if sig == signal.SIGINT:
			print("Client interrupted")
		else:
			print("Client terminated")
		await game.quit()
	
	signal.signal(signal.SIGINT, lambda sig, frame: asyncio.create_task(sig_handler(sig, frame)))
	signal.signal(signal.SIGTERM, lambda sig, frame: asyncio.create_task(sig_handler(sig, frame)))

	try:
		async with websockets.connect("wss://{}:8765".format(ip), ssl=ssl_context) as websocket:
			await try_connect(websocket)
			await in_game(websocket)
	except ConnectionRefusedError as e:
		print("Connection failed: {}".format(e))
		return(1)


asyncio.run(main())
