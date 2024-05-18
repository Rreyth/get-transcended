import os
import sys
import ssl
import websockets
import asyncio
import json
# from myapp import models

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

#verifie la validiter d'un user et renvoie les infos au game serv
async def creds_verificator(message, websocket): #wait for db and user
	alias = "ALIAS"
	if message['cmd'] == "username":
		msg = {'type' : 'connectionRpl', 'success' : 'true', 'error' : 'none', 'id' : message['id'], 'alias' : alias} #add user name / pseudo
		# msg = {'type' : 'connectionRpl', 'success' : 'false', 'error' : 'invalid username or password'}
	if message['cmd'] == "token":
		msg = {'type' : 'connectionRpl', 'success' : 'true', 'error' : 'none', 'id' : message['id'], 'alias' : alias} #add user name / pseudo
		# msg = {'type' : 'connectionRpl', 'success' : 'false', 'error' : 'invalid token'}
	await websocket.send(json.dumps(msg))


#stock les infos de fin de game recu en db
def db_storage(message):
	pass

async def parse(message, websocket):
	print(message)
	if message['type'] == "connect":
		await creds_verificator(message, websocket)
	elif message['type'] == "endGame":
		db_storage(message)

async def main():
	async with websockets.connect("wss://pong:8765", ssl=ssl_context) as websocket:
		await websocket.send(json.dumps({'type' : "DJANGO"}))
		try:
			async for message in websocket:
				await parse(json.loads(message), websocket)
	
		finally:
			print("Game Server disconnected")


asyncio.run(main())