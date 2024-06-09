from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *
from users.models import User
from asgiref.sync import sync_to_async
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add(self.scope['user'].username, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.scope['user'].username, self.channel_name)

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        chat_type = data_json['type']

        if chat_type == 'PrivateChat':
            await self.send_private_message(data_json)
        elif chat_type == 'GroupChat':
            await self.send_group_message(data_json)

    async def send_private_message(self, data_json):
        recever = await sync_to_async(User.objects.get)(username=data_json['room_name'])
        is_friend = await sync_to_async(recever.friends.contains)(self.scope['user'])

        if not is_friend:
            return
        
        message = await sync_to_async(Message.objects.create)(
            content=data_json['message'],
            sender=self.scope['user'],
            receiver=recever
        )

        await self.channel_layer.group_send(
            recever.username,
            {
                'type': 'broadcast',
                'message': message,
                'chat_type': 'PRIVATE',
            }
        )
        await self.channel_layer.group_send(
            self.scope['user'].username,
            {
                'type': 'broadcast',
                'message': message,
                'chat_type': 'PRIVATE',
            }
        )

    async def send_group_message(self, data_json):
        group = await sync_to_async(Group.objects.get)(pk=data_json['room_name'])
        is_member = await sync_to_async(group.members.contains)(self.scope['user'])

        if not is_member:
            return
        
        message = await sync_to_async(Message.objects.create)(
            content=data_json['message'],
            sender=self.scope['user'],
            group=group
        )

        for member in group.members.all():
            await self.channel_layer.group_send(
                member.username,
                {
                    'type': 'broadcast',
                    'message': message,
                    'chat_type': 'GROUP',
                }
            )

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'].content,
            'sender': event['message'].sender.username,
            'date': event['message'].created_at.strftime('%m/%d/%Y')
        }))