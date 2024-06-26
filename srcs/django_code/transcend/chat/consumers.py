from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .serializer import GroupSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add(f"{self.scope['user'].username}_chat", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(f"{self.scope['user'].username}_chat", self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'].content,
            'sender': event['message'].sender.username,
            'date': event['message'].created_at.strftime('%m/%d/%Y'),
            'room_name': event['room_name'],
        }))

class GroupConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add(f"{self.scope['user'].username}_group", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(f"{self.scope['user'].username}_group", self.channel_name)

    async def receive(self, text_data):
        pass

    async def new_group(self, event):
        await self.send(text_data=json.dumps({
            'group': event['group'],
        }))