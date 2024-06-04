from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User, FriendRequest
from .serializer import UserSerializer, FriendRequestSerializer
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterUserView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    def post(self, request):
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({'access' : str(refresh.access_token)}, status=status.HTTP_201_CREATED)
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
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user.friends, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class FriendRequestsView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        if 'to_user' not in request.data:
            return Response({'message': 'to_user field is required'}, status=status.HTTP_400_BAD_REQUEST)

        req, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user_id=int(request.data['to_user']))
        if created:
            return Response({'message': 'Friend request created'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Friend request was already send'}, status=status.HTTP_200_OK)
    
    def get(self, request):
        received = FriendRequest.objects.filter(to_user=request.user)
        send = FriendRequest.objects.filter(from_user=request.user)

        return Response({'send': FriendRequestSerializer(send, fields=('id', 'to_user'), many=True).data, 'received': FriendRequestSerializer(received, fields=('id', 'from_user'), many=True).data}, status=status.HTTP_200_OK)

class FriendRequestView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request, request_id):
        try:
            friendRequest = FriendRequest.objects.get(pk=request_id)

            if friendRequest.to_user == request.user:
                friendRequest.to_user.friends.add(friendRequest.from_user)
                friendRequest.from_user.friends.add(friendRequest.to_user)
                friendRequest.delete()

                return Response({'message': 'Success'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        except FriendRequest.DoesNotExist:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, request_id):
        try:
            friendRequest = FriendRequest.objects.get(pk=request_id)

            if friendRequest.from_user == request.user:
                friendRequest.delete()

                return Response({'message': 'Success'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        except FriendRequest.DoesNotExist:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)