from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async

class OnlineConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        self.scope["user"].online = True
        await sync_to_async(self.scope["user"].save)()
        
    async def disconnect(self, close_code):
        self.scope["user"].online = True
        await sync_to_async(self.scope["user"].save)()
        
        await self.channel_layer.group_discard(self.scope['user'].username, self.channel_name)
        self.clean_session_data()