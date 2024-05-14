from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User
from .serializer import UserSerializer

class RegisterUserView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    def post(self, request):

        if User.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = User.objects.get(email=request.user.email)
        user.avatar = request.data['avatar']
        user.save()
        return Response({'message': 'Image updated'}, status=status.HTTP_200_OK)

import sys

class FriendView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser,]

    def get(self, request):
        serializer = UserSerializer(request.user.friends, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            request.user.friends.add(request.data['user'])

            return Response({'message': 'Friend add'}, status=status.HTTP_201_CREATED)
        except KeyError:
            return Response({'error': 'user field is required'}, status=status.HTTP_400_BAD_REQUEST)