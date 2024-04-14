import asyncio
import websockets
import json
import os
import time
import random
import string
import signal
import ssl

starting_port = 6670

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain("/certs/cert.pem")

ssl_context_client = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context_client.load_verify_locations("/certs/cert.pem")

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
		self.players = set()
		self.players_nb = 0
  
	async def sendAll(self, msg : dict):
		for player in self.players:
			await player.send(json.dumps(msg))
	
	async def cleanEmpty(self):
		global used_port, used_id
		async with websockets.connect("ws://{}:{}".format(self.host, self.port)) as gameSocket:
			msg = {'type' : 'close'}
			await gameSocket.send(json.dumps(msg))
			await gameSocket.close()
		used_port.remove(self.port)
		used_id.remove(self.id)


rooms = {}

used_port = []
used_id = []

fordiben_port = [8000, 8001, 44433, 5432, 6720]

clients = set()

async def send_to_DB(msg : dict): #add players infos + send to main serv for db
	pass


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
				rooms[id].players.remove(websocket)
				rooms[id].players_nb -= 1
			else:
				rooms[id].players.remove(websocket)
				rooms[id].players_nb -= 1
				await rooms[id].sendAll({'type' : 'endGame', 'cmd' : 'quitWait', 'id': msg['id']})
			if rooms[id].players.__len__() == 0:
				await rooms[id].cleanEmpty()
				rooms.pop(id)
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
	if client_msg['cmd'] == "username":
		#demande serv principale de verifier les creds du user
		#if success
		msg = {'type' : 'connectionRpl', 'success' : 'true', 'error' : 'none'} #add : 'alias' : {response['alias']}
		print(f"CONNECT, user: {client_msg['username']}") # add : alias: {response['alias']}
		#if failure
		# msg = {'type' : 'connectionRpl', 'success' : 'false', 'error' : 'invalid username or password'}
		await websocket.send(json.dumps(msg))
	if client_msg['cmd'] == "token":
		#same same but different
		msg = {'type' : 'connectionRpl', 'success' : 'true', 'error' : 'none'} #add : 'alias' : {response['alias']}
		await websocket.send(json.dumps(msg))
	
async def run_game(id, websocket):
	global rooms, used_port, used_id
	for room in rooms.values():
		if room.id == id:
			async with websockets.connect("ws://{}:{}".format(room.host, room.port)) as gameSocket:
				msg = {'type' : 'create', 'cmd' : room.type, 'mods' : room.mods, 'Room_id' : room.id, 'score' : room.score, 'ai' : room.ai_nb, 'players' : room.max_players}
				await gameSocket.send(json.dumps(msg))
				await asyncio.sleep(0.01)
				await websocket.send(json.dumps({'type' : 'start'}))
				try:
					async for message in gameSocket:
						msg :dict = json.loads(message)
						print(msg) #send it to serv for db stockage / histo
						if msg['type'] == 'endGame':
							break

				finally:
					if id in rooms.keys():
						rooms.pop(room.id)
						used_id.remove(room.id)
						used_port.remove(room.port)
					break
 
 
async def handle_join(client_msg, websocket):
	global rooms, used_port, used_id
	if client_msg['id'] not in used_id:
		await websocket.send(json.dumps({'type' : 'joinResponse', 'success' : 'false'}))
		return

	for room in rooms.values():
		if room.id == client_msg['id']:
			await room.sendAll({"type" : "join"})
			room.players.add(websocket)
			room.players_nb += 1
			await websocket.send(json.dumps({'type' : 'joinResponse', 'success' : 'true', 'socket' : 'ws://{}:{}'.format(room.host, room.port), 'pos' : room.players_nb, 'max' : room.max_players, 'mode' : room.type, 'custom_mods' : room.mods}))
			await full_room(room.id, websocket)
			if client_msg['id'] in rooms.keys() and rooms[room.id].full:
				await run_game(room.id, websocket)
			return

async def handle_custom(client_msg, websocket):
	global rooms, used_port, used_id
	if client_msg['online']	== 'false':
		msg : dict = json.loads(await websocket.recv())
		while msg['type'] != 'endGame':
			msg : dict = json.loads(await websocket.recv())
		print(msg) #send it to serv for db stockage / histo
  
	else:
		port = starting_port
		while port in used_port or port in fordiben_port: port += 1
		used_port.append(port)
		host = 'localhost'
		os.system("python3 game/core.py {} {} &".format(host, port))
		time.sleep(0.1)
		room_id = id_generator()
		used_id.append(room_id)
		rooms[room_id] = Room(room_id, host, port, 'custom', client_msg['players'])
		rooms[room_id].mods = client_msg['mods']
		rooms[room_id].score = client_msg['score']
		rooms[room_id].ai_nb = client_msg['ai']
		rooms[room_id].players.add(websocket)
		rooms[room_id].players_nb = client_msg['ai'] + 1
		await websocket.send(json.dumps({'type' : 'GameRoom', 'ID' : room_id, 'socket' : 'ws://{}:{}'.format(host, port), 'pos' : rooms[room_id].players_nb}))
		await full_room(room_id, websocket)
		if room_id in rooms.keys() and rooms[room_id].full:
			await run_game(room_id, websocket)


async def handle_quickGame(client_msg, websocket):
	global rooms, used_port, used_id
	if client_msg['online'] == 'false':
		response : dict = json.loads(await websocket.recv())
		while response['type'] != 'endGame':
			response : dict = json.loads(await websocket.recv())
		print(response)
		#send it to serv for db stockage

	elif client_msg['online'] == 'true':
		for room in rooms.values():
			if not room.full and room.type == 'quickGame':
				await room.sendAll({"type" : "join"})
				room.players.add(websocket)
				room.players_nb += 1
				await websocket.send(json.dumps({'type' : 'GameRoom', 'ID' : room.id, 'socket' : 'ws://{}:{}'.format(room.host, room.port), 'pos' : room.players_nb}))
				id = room.id
				await full_room(room.id, websocket)
				if id in rooms.keys() and rooms[room.id].full:
					await run_game(room.id, websocket)
				return

		port = starting_port
		while port in used_port or port in fordiben_port: port += 1
		used_port.append(port)
		host = 'localhost'
		os.system("python3 game/core.py {} {} &".format(host, port))
		time.sleep(0.1)

		room_id = id_generator()
		used_id.append(room_id)
		rooms[room_id] = Room(room_id, host, port, 'quickGame', 2)
		rooms[room_id].players.add(websocket)
		rooms[room_id].players_nb = 1
		await websocket.send(json.dumps({'type' : 'GameRoom', 'ID' : room_id, 'socket' : 'ws://{}:{}'.format(host, port), 'pos' : rooms[room_id].players_nb}))
		await full_room(room_id, websocket)
		if room_id in rooms.keys() and rooms[room_id].full:
			await run_game(room_id, websocket)


async def parse_msg(message, websocket):
	client_msg : dict = json.loads(message)

	# print('client message : ', client_msg) #keep for logs / debug ?
	if client_msg["type"] == "connect":
		await connection_handler(client_msg, websocket)
	if client_msg["type"] == "quickGame":
		await handle_quickGame(client_msg, websocket)
	if client_msg["type"] == "join":
		await handle_join(client_msg, websocket)
	if client_msg["type"] == "custom":
		await handle_custom(client_msg, websocket)

async def handle_client(websocket):
	clients.add(websocket)
	# print(f"connected from {websocket.remote_address[0]}:{websocket.remote_address[1]}")
 
	try:
		async for message in websocket:
			await parse_msg(message, websocket)

	finally:
		clients.remove(websocket)
		# print(f"disconnected from {websocket.remote_address[0]}:{websocket.remote_address[1]}")

async def main():
	loop = asyncio.get_running_loop()
	stop = loop.create_future()
	loop.add_signal_handler(signal.SIGINT, stop.set_result, None)
	loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
 
	async with websockets.serve(handle_client, "0.0.0.0", 6669, ssl=ssl_context):
		await stop
	print("\nServer stopped")

if __name__ == "__main__":
	asyncio.run(main())
