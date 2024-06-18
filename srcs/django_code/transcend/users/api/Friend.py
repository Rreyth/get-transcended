from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User
from users.serializer import UserSerializer
from django.shortcuts import get_object_or_404

class FriendView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        target = request.query_params.get('target')

        if target:
            friend = get_object_or_404(User, username=target)
            if friend in request.user.get_non_blocked_friends():
                serializer = UserSerializer(friend)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Friend not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            non_blocked_friends = request.user.get_non_blocked_friends()
            serializer = UserSerializer(non_blocked_friends, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
