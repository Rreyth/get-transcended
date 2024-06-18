from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import User
from chat.models import *
from chat.serializer import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class DMView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = MessageSerializer

    def get(self, request, username):
        try:
            u = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        messages = Message.objects.filter(Q(receiver=request.user, sender=u) | Q(receiver=u, sender=request.user))
        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, username):
        try:
            receiver = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user in receiver.blocked_users.all():
            return Response(status=status.HTTP_403_FORBIDDEN)

        message = Message.objects.create(content=request.data['content'], sender=request.user, receiver=receiver)
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"{receiver.username}_chat",
            {
                'type': 'send_message',
                'message': message,
                'room_name': self.request.user.username,
            }
        )

        async_to_sync(channel_layer.group_send)(
            f"{self.request.user.username}_chat",
            {
                'type': 'send_message',
                'message': message,
                'room_name': receiver.username,
            }
        )

        return Response({'message': 'Created'}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, receiver=self.request.user)
