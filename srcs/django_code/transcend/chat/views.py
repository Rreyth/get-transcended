from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import User
from .models import *
from .serializer import *
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
        
        message = Message.objects.create(content=request.data['content'], sender=request.user, receiver=receiver)
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            receiver.username,
            {
                'type': 'broadcast',
                'message': message,
                'room_name': self.request.user.username,
            }
        )
        
        async_to_sync(channel_layer.group_send)(
            self.request.user.username,
            {
                'type': 'broadcast',
                'message': message,
                'room_name': receiver.username,
            }
        )
        
        return Response({'message': 'Created'}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, receiver=self.request.user)

class GroupView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get(self, request, group_id):
        group = Group.objects.get(pk=group_id)
        serializer = GroupSerializer(group)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, group_id):
        g = Group.objects.get(pk=group_id)
        if request.user == g.owner:
            g.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    def put(self, request, group_id):
        group = Group.objects.get(pk=group_id)

        data = request.data
        if 'name' in data:
            group.name = data['name']

        if 'members' in data:
            members = data['members']
            if isinstance(members, list):
                for member in members:
                    try:
                        user = User.objects.get(username=member)
                        group.members.add(user)
                    except User.DoesNotExist:
                        return Response({'error': f'User with id {member} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Group update'}, status=status.HTTP_200_OK)

class GroupLeaveView(APIView):
    def post(self, request, group_id):
        if group_id == 1:
            return Response({'message': 'You can\'t leave general chat'}, status=status.HTTP_403_FORBIDDEN)
        
        group = Group.objects.get(pk=group_id)
        
        group.members.remove(request.user)
        
        if (group.members.count() == 0):
            group.delete()

        return Response(status=status.HTTP_200_OK)

class GroupsView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = GroupSerializer

    def get(self, request):
        groups = Group.objects.filter(members=request.user)
        serializer = GroupSerializer(groups, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user, members=[request.user])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

        message = Message.objects.create(content=request.data['content'], sender=request.user, group=group)
        
        channel_layer = get_channel_layer()

        for member in group.members.all():
            async_to_sync(channel_layer.group_send)(
                member.username,
                {
                    'type': 'broadcast',
                    'message': message,
                    'room_name': group.id,
                }
            )

        return Response({'message': 'Created'}, status=status.HTTP_201_CREATED)