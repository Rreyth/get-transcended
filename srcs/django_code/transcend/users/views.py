from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User, Friend
from .serializer import UserSerializer

class RegisterUserView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    def post(self, request):
        
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

class FriendView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser,]

    def get(self, request):
        serializer = UserSerializer(request.user.friends.objects.get(accept=True), many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            # request.user.friends.add(request.data['user'])
            Friend.objects.create(sender=request.user, receiver_id=int(request.data['receiver']))

            return Response({'message': 'Friend request success'}, status=status.HTTP_201_CREATED)
        except KeyError:
            return Response({'error': 'receiver field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        if 'sender' not in request.data:
            return Response({'error': 'sender field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        friend = Friend.objects.get(sender_id=int(request.data['sender']), receiver=request.user)
        
        friend.accept = True
        friend.save()
        
        return Response({'message': 'Friend confirm success'}, status=status.HTTP_200_OK)