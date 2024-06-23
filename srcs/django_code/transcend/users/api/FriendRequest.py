from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import FriendRequest

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
