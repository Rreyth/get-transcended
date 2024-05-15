from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.channel_layer.group_add(str(self.scope["user"].id), self.channel_name)
  
		await self.accept()

	async def disconnect(self, close_code):
		await self.close()
  
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']

		await self.channel_layer.group_send(
            str(text_data_json['recever_id']),
            {
                'type': 'chat_message',
                'message': message
            }
        )

	async def chat_message(self, event):
		message = event['message']

		await self.send(text_data=json.dumps({
            'message': message,
            'username': 'swotex',
            'date': "27/03/2024 12:40"
        }))