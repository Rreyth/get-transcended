from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add(self.scope['user'].username, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.scope['user'].username, self.channel_name)

    async def receive(self, text_data):
        pass

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'].content,
            'sender': event['message'].sender.username,
            'date': event['message'].created_at.strftime('%m/%d/%Y'),
            'room_name': event['room_name'],
        }))