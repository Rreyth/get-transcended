from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from chat.models import *
from chat.serializer import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from transcend.views.utils import escape_html_in_data

class GroupMessagesView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, group_id):
        messages = Message.objects.filter(group_id=group_id)

        serializer = MessageSerializer(messages, many=True, fields=('id', 'content', 'sender', 'created_at'))

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, group_id):
        try:
            group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({'error': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)

        message = Message.objects.create(content=escape_html_in_data(request.data['content']), sender=request.user, group=group)

        channel_layer = get_channel_layer()

        for member in group.members.all():
            async_to_sync(channel_layer.group_send)(
                f"{member.username}_chat",
                {
                    'type': 'send_message',
                    'message': message,
                    'room_name': group.id,
                }
            )

        return Response({'message': 'Created'}, status=status.HTTP_201_CREATED)
