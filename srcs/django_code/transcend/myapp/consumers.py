from channels.generic.websocket import AsyncWebsocketConsumer
from myapp.models import PrivateMessage
from users.models import User
from asgiref.sync import sync_to_async
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

		recever = await sync_to_async(User.objects.get, thread_sensitive=True)(pk=text_data_json['recever_id'])
		private_message = await sync_to_async(PrivateMessage.objects.create)(content=message, recever=recever, sender=self.scope['user'])

		await self.channel_layer.group_send(
            str(text_data_json['recever_id']),
            {
                'type': 'broadcast',
                'private_message': private_message
            }
        )

	async def broadcast(self, event):

		await self.send(text_data=json.dumps({
            'message': event['private_message'].content,
            'username': event['private_message'].recever.username,
            'date': event['private_message'].created_at.strftime('%m/%d/%Y')
        }))