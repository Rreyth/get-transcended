from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.models import User
from .models import *
from .serializer import *

class DMView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = MessageSerializer

    def get(self, request, username):
        u = User.objects.get(username=username)
        messages = Message.objects.filter(Q(receiver=request.user, sender=u) | Q(receiver=u, sender=request.user))
        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, receiver=self.request.user)


class GroupView(APIView):
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
    
    def delete(self, request, group):
        g = Group.objects.get(pk=group)
        if request.user == g.owner:
            g.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

class GroupMessagesView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get(self, request, group_id):
        messages = Message.objects.filter(group_id=group_id)
        
        serializer = MessageSerializer(messages, many=True, fields=('id', 'content', 'sender', 'created_at'))

        return Response(serializer.data, status=status.HTTP_200_OK)