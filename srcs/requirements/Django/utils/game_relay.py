import os
import sys
import ssl
import websockets
import asyncio
import json

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

async def main():
	async with websockets.connect("wss://pong:6669", ssl=ssl_context) as websocket:
		await websocket.send(json.dumps({'type' : "DJANGO"}))
		msg = await websocket.recv()
		print(json.loads(msg))
		await websocket.close()


asyncio.run(main())