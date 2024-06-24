from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from users.models import User

class OnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        await self.channel_layer.group_add(self.scope['user'].username, self.channel_name)

        self.scope["user"].online = True
        await sync_to_async(self.scope["user"].save)(update_fields=['online'])
        
        users = await database_sync_to_async(list)(User.objects.filter(online=True))

        for u in users:
            await self.channel_layer.group_send(
                u.username,
                {
                    'type': 'user_status',
                    'user': self.scope["user"],
                    'online': True,
                }
            )
        
    async def disconnect(self, close_code):
        self.scope["user"].online = False
        await sync_to_async(self.scope["user"].save)(update_fields=['online'])
        
        users = await database_sync_to_async(list)(User.objects.filter(online=True))

        for u in users:
            await self.channel_layer.group_send(
                u.username,
                {
                    'type': 'user_status',
                    'user': self.scope["user"],
                    'online': False,
                }
            )
        
        await self.channel_layer.group_discard(self.scope['user'].username, self.channel_name)
        
    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'username': event['user'].username,
            'online': event['online'],
        }))

class FriendAcceptConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add(f"{self.scope['user'].username}_friend", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(f"{self.scope['user'].username}_friend", self.channel_name)
    
    async def friend_accept(self, event):
        await self.send(text_data=json.dumps({
            'user': event['user'],
        }))