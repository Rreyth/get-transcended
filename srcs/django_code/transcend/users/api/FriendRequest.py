from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import FriendRequest
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from users.serializer import UserSerializer

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

                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f"{friendRequest.from_user.username}_friend",
                    {
                        'type': 'friend_accept',
                        'user': UserSerializer(friendRequest.to_user).data
                    }
                )

                async_to_sync(channel_layer.group_send)(
                    f"{friendRequest.to_user.username}_friend",
                    {
                        'type': 'friend_accept',
                        'user': UserSerializer(friendRequest.from_user).data
                    }
                )

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
