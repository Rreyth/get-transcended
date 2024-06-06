import asyncio
import websockets
import json
import os
import time
import random
import string
import signal
import ssl
import sys
import requests
import urllib3

urllib3.disable_warnings()

BASE_URL = "https://nginx:44433/api/"

starting_port = 8766

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain("/certs/cert.pem")

ssl_context_client = ssl.create_default_context()
ssl_context_client.check_hostname = False
ssl_context_client.verify_mode = ssl.CERT_NONE

class Room:
	def __init__(self, id, host, port, type, max_players = 2):
		self.id = id
		self.host = host
		self.port = port
		self.full = False
		self.type = type
		self.mods = []
		self.score = 10
		self.ai_nb = 0
		self.max_players = max_players
		self.players = []
		self.players_nb = 0
  
	async def sendAll(self, msg : dict):
		for player in self.players:
			await player.websocket.send(json.dumps(msg))
	
	async def cleanEmpty(self):
		global used_port, used_id
		async with websockets.connect("wss://{}:{}".format(self.host, self.port), ssl=ssl_context_client) as gameSocket:
			msg = {'type' : 'close'}
			await gameSocket.send(json.dumps(msg))
			await gameSocket.close()
		used_port.remove(self.port)
		used_id.remove(self.id)

class Player:
	def __init__(self, websocket):
		self.websocket = websocket
		self.name = "ALIAS"

rooms = {}

used_port = []
used_id = []

forbiden_port = [8000, 8001, 44433, 5432, 6720]

clients = {}
registered = {}
client_id = 0
SECRET_KEY = os.getenv("SECRET")

async def send_to_DB(msg : dict):
	if not msg['online']:
		return
	headers = {'Content-Type' : 'application/json'}
	msg['secret'] = SECRET_KEY
	payload = json.dumps(msg)
	url = BASE_URL + 'game/'
	requests.request("POST", url, headers=headers, data=payload, verify=False)

async def full_room(id, websocket):
	global rooms
	while not rooms[id].full:
		try:
			msg :dict = json.loads(await asyncio.wait_for(websocket.recv(), timeout=0.01))
		except asyncio.TimeoutError:
			msg = {'type' : 'none'}
		if msg['type'] == 'quitGame':
			if 'cmd' in msg.keys() and msg['cmd'] == 'quitWait':
				await rooms[id].sendAll({'type' : 'endGame', 'cmd' : 'quitWait', 'id': msg['id']})
				for player in rooms[id].players:
					if player.websocket == websocket:
						rooms[id].players.remove(player)
						break
				rooms[id].players_nb -= 1
			else:
				for player in rooms[id].players:
					if player.websocket == websocket:
						rooms[id].players.remove(player)
						break
				rooms[id].players_nb -= 1
				await rooms[id].sendAll({'type' : 'endGame', 'cmd' : 'quitWait', 'id': msg['id']})
			if rooms[id].players.__len__() == 0:
				await rooms[id].cleanEmpty()
				del rooms[id]
			break
		if rooms[id].players_nb == rooms[id].max_players:
			rooms[id].full = True

def id_generator():
	set = string.ascii_uppercase + string.digits.replace('0', '')
	id = ''.join(random.choice(set) for i in range(4))
	while id in used_id:
		id = ''.join(random.choice(set) for i in range(4))
	return id

async def connection_handler(client_msg, websocket):
	global clients, registered
	if client_msg['cmd'] == 'token':
		if client_msg['token'] == None:
			msg = {'type' : 'connectionRpl', 'success' : 'false', 'error' : 'invalid token'}
			await websocket.send(json.dumps(msg))
			return
		method = 'GET'
		url = BASE_URL + "user/"
		headers = {'Authorization' : 'Bearer ' + client_msg['token']}
		payload = {}
	
	elif client_msg['cmd'] == 'username':
		method = 'POST'
		url = BASE_URL + "token/"
		headers = {'Content-Type' : 'application/json'}
		payload = json.dumps({'username' : client_msg['username'],
                        		'password' : client_msg['password']})

	response = requests.request(method, url, headers=headers, data=payload, verify=False)
	data = response.json()
	if response.status_code != 200:
		if client_msg['cmd'] == 'token':
			msg = {'type' : 'connectionRpl', 'success' : 'false', 'error' : 'invalid token'}
		elif client_msg['cmd'] == 'username':
			msg = {'type' : 'connectionRpl', 'success' : 'false', 'error' : 'invalid username or password'}
	else:
		msg = {'type' : 'connectionRpl', 'success' : 'true', 'error' : 'none'}
		for id, player in clients.items():
			if player.websocket == websocket:
				player.name = data.get('username') if data.get('username') != None else client_msg['username']
				registered[id] = websocket
				break
	await websocket.send(json.dumps(msg))
	
async def run_game(id, websocket):
	global rooms, used_port, used_id
	for room in rooms.values():
		if room.id == id:
			async with websockets.connect("wss://{}:{}".format(room.host, room.port), ssl=ssl_context_client) as gameSocket:
				msg = {'type' : 'create', 'cmd' : room.type, 'mods' : room.mods, 'Room_id' : room.id, 'score' : room.score, 'ai' : room.ai_nb, 'players' : room.max_players}
				await gameSocket.send(json.dumps(msg))
				await asyncio.sleep(0.01)
				await websocket.send(json.dumps({'type' : 'start'}))
				try:
					async for message in gameSocket:
						msg :dict = json.loads(message)
						if msg['type'] == 'endGame':
							await send_to_DB(msg)
							break

				except websockets.exceptions.ConnectionClosedOK:
					print(f"Game room {id} closed connection", file=sys.stderr, flush=True)
     
				except websockets.exceptions.ConnectionClosedError:
					print(f"Game room {id} connection error", file=sys.stderr, flush=True)

				finally:
					if id in rooms.keys():
						del rooms[room.id]
						used_id.remove(room.id)
						used_port.remove(room.port)
					break
 
 
async def handle_join(client_msg, websocket):
	global rooms, used_port, used_id, clients
	if client_msg['id'] not in used_id:
		room_id = client_msg['id']
		await websocket.send(json.dumps({'type' : 'joinResponse', 'success' : 'false', 'error' : f'Room {room_id} doesn\'t exist'}))
		return

	for room in rooms.values():
		if room.id == client_msg['id']:
			if not room.full:
				for player in clients.values():
					if player.websocket == websocket:
						await room.sendAll({"type" : "join", "alias" : player.name})
						room.players.append(player)
						break
				room.players_nb += 1
				msg = {'type' : 'joinResponse', 'success' : 'true', 'port' : room.port, 'pos' : room.players_nb, 'max' : room.max_players, 'mode' : room.type, 'custom_mods' : room.mods}
				if room.type == 'tournament':
					msg['pos'] = room.players_nb - room.ai_nb
					msg['score'] = room.score
					msg['ai'] = room.ai_nb
					msg['players'] = [player.name for player in room.players]
				await websocket.send(json.dumps(msg))
				await full_room(room.id, websocket)
				if client_msg['id'] in rooms.keys() and rooms[room.id].full:
					await run_game(room.id, websocket)
			else:
				await websocket.send(json.dumps({'type' : 'joinResponse', 'success' : 'false', 'error' : f'Room {room.id} is already full'}))
			return

async def handle_tournament(client_msg, websocket):
	global rooms, used_port, used_id, clients
	if client_msg['online']	== 'false':
		msg : dict = json.loads(await websocket.recv())
		while msg['type'] != 'endGame' and msg['type'] != 'quitGame':
			msg : dict = json.loads(await websocket.recv())
		await send_to_DB(msg)
  
	else:
		port = starting_port
		while port in used_port or port in forbiden_port: port += 1
		used_port.append(port)
		host = '0.0.0.0'
		room_id = id_generator()
		used_id.append(room_id)
		os.system("python3 game/core.py {} {} {} &".format(host, port, room_id))
		time.sleep(0.1)
		rooms[room_id] = Room(room_id, host, port, 'tournament', client_msg['players'])
		rooms[room_id].mods = client_msg['mods']
		rooms[room_id].score = client_msg['score']
		rooms[room_id].ai_nb = client_msg['ai']
		for player in clients.values():
			if player.websocket == websocket:
				rooms[room_id].players.append(player)
				break
		rooms[room_id].players_nb = client_msg['ai'] + 1
		await websocket.send(json.dumps({'type' : 'TournamentRoom', 'ID' : room_id, 'port' : port, 'pos' : rooms[room_id].players_nb - client_msg['ai']}))
		await full_room(room_id, websocket)
		if room_id in rooms.keys() and rooms[room_id].full:
			await run_game(room_id, websocket)

async def handle_custom(client_msg, websocket):
	global rooms, used_port, used_id, clients
	if client_msg['online']	== 'false':
		msg : dict = json.loads(await websocket.recv())
		while msg['type'] != 'endGame':
			msg : dict = json.loads(await websocket.recv())
		await send_to_DB(msg)
  
	else:
		port = starting_port
		while port in used_port or port in forbiden_port: port += 1
		used_port.append(port)
		host = '0.0.0.0'
		room_id = id_generator()
		used_id.append(room_id)
		os.system("python3 game/core.py {} {} {} &".format(host, port, room_id))
		time.sleep(0.1)
		rooms[room_id] = Room(room_id, host, port, 'custom', client_msg['players'])
		rooms[room_id].mods = client_msg['mods']
		rooms[room_id].score = client_msg['score']
		rooms[room_id].ai_nb = client_msg['ai']
		for player in clients.values():
			if player.websocket == websocket:
				rooms[room_id].players.append(player)
				break
		rooms[room_id].players_nb = client_msg['ai'] + 1
		await websocket.send(json.dumps({'type' : 'GameRoom', 'ID' : room_id, 'port' : port, 'pos' : rooms[room_id].players_nb}))
		await full_room(room_id, websocket)
		if room_id in rooms.keys() and rooms[room_id].full:
			await run_game(room_id, websocket)


async def handle_quickGame(client_msg, websocket):
	global rooms, used_port, used_id, clients
	if client_msg['online'] == 'false':
		response : dict = json.loads(await websocket.recv())
		while response['type'] != 'endGame':
			response : dict = json.loads(await websocket.recv())
		await send_to_DB(response)

	elif client_msg['online'] == 'true':
		for room in rooms.values():
			if not room.full and room.type == 'quickGame':
				await room.sendAll({"type" : "join"})
				for player in clients.values():
					if player.websocket == websocket:
						room.players.append(player)
						break
				room.players_nb += 1
				await websocket.send(json.dumps({'type' : 'GameRoom', 'ID' : room.id, 'port' : room.port, 'pos' : room.players_nb}))
				id = room.id
				await full_room(room.id, websocket)
				if id in rooms.keys() and rooms[room.id].full:
					await run_game(room.id, websocket)
				return

		port = starting_port
		while port in used_port or port in forbiden_port: port += 1
		used_port.append(port)
		host = '0.0.0.0'
		room_id = id_generator()
		used_id.append(room_id)
		os.system("python3 game/core.py {} {} {} &".format(host, port, room_id))
		time.sleep(0.1)

		rooms[room_id] = Room(room_id, host, port, 'quickGame', 2)
		for player in clients.values():
			if player.websocket == websocket:
				rooms[room_id].players.append(player)
				break
		rooms[room_id].players_nb = 1
		await websocket.send(json.dumps({'type' : 'GameRoom', 'ID' : room_id, 'port' : port, 'pos' : rooms[room_id].players_nb}))
		await full_room(room_id, websocket)
		if room_id in rooms.keys() and rooms[room_id].full:
			await run_game(room_id, websocket)


async def parse_msg(message, websocket):
	client_msg : dict = json.loads(message)

	if client_msg["type"] == "connect":
		await connection_handler(client_msg, websocket)
  
	if not is_registered(websocket):
		return

	if client_msg["type"] == "quickGame":
		await handle_quickGame(client_msg, websocket)
	if client_msg["type"] == "join":
		await handle_join(client_msg, websocket)
	if client_msg["type"] == "custom":
		await handle_custom(client_msg, websocket)
	if client_msg["type"] == "tournament":
		await handle_tournament(client_msg, websocket)

async def handle_client(websocket):
	global clients, registered
	for id in range(10000):
		if not id in clients:
			clients[id] = Player(websocket)
			break

	try:
		async for message in websocket:
			await parse_msg(message, websocket)

	except websockets.exceptions.ConnectionClosedError:
		for key, player in clients.items():
			if player.websocket == websocket:
				print(f"Game hub: Client {key}: Connection Closed Error", file=sys.stderr)
				break
	except websockets.exceptions.ConnectionClosedOK:
		for key, player in clients.items():
			if player.websocket == websocket:
				print(f"Game hub: Client {key}: Closed connection", file=sys.stderr)
				break

	finally:
		for key, player in clients.items():
			if player.websocket == websocket:
				del clients[key]
				if is_registered(websocket):
					del registered[key]
				break
		await quit_room(websocket)

async def quit_room(websocket):
	global rooms, used_port, used_id, clients
	for id, room in rooms.items():
		for player in clients.values():
			if player.websocket == websocket and player in room.players:
				if not room.full:
					index = room.players.index(player) + 1
					rooms[id].players.remove(player)
					rooms[id].players_nb -= 1
					await rooms[id].sendAll({'type' : 'endGame', 'cmd' : 'quitWait', 'id': index})
				if rooms[id].players.__len__() == 0:
					await rooms[id].cleanEmpty()
					del rooms[id]
				break
		break


def is_registered(websocket):
	global registered

	for ws in registered.values():
		if ws == websocket:
			return True
	return False


async def main():
	loop = asyncio.get_running_loop()
	stop = loop.create_future()
	loop.add_signal_handler(signal.SIGINT, stop.set_result, None)
	loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
	async with websockets.serve(handle_client, "0.0.0.0", 8765, ssl=ssl_context):
		await stop
	print("\nServer stopped", file=sys.stderr)

if __name__ == "__main__":
	asyncio.run(main())