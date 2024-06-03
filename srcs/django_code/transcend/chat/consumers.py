from channels.generic.websocket import AsyncWebsocketConsumer
from .models import PrivateMessage
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
        is_friend = await sync_to_async(recever.friends.contains, thread_sensitive=True)(self.scope['user'])

        if not is_friend:
            return
        
        private_message = await sync_to_async(PrivateMessage.objects.create)(content=message, recever=recever, sender=self.scope['user'])

        await self.channel_layer.group_send(
            str(text_data_json['recever_id']),
            {
                'type': 'broadcast',
                'private_message': private_message
            }
        )
        await self.channel_layer.group_send(
            str(self.scope["user"].id),
            {
                'type': 'broadcast',
                'private_message': private_message
            }
        )

    async def broadcast(self, event):

        await self.send(text_data=json.dumps({
            'message': event['private_message'].content,
            'username': event['private_message'].sender.username,
            'date': event['private_message'].created_at.strftime('%m/%d/%Y')
        }))