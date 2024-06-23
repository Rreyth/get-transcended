from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import FriendRequest, User
from users.serializer import FriendRequestSerializer

class FriendRequestsView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        if 'to_user' not in request.data:
            return Response({'message': 'to_user field is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(username=request.data['to_user'])

        req, created = FriendRequest.objects.get_or_create(from_user=request.user, to_user=user)
        if created:
            return Response({'message': 'Friend request created'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Friend request was already send'}, status=status.HTTP_200_OK)

    def get(self, request):
        received = FriendRequest.objects.filter(to_user=request.user)
        send = FriendRequest.objects.filter(from_user=request.user)

        return Response({'send': FriendRequestSerializer(send, fields=('id', 'to_user'), many=True).data, 'received': FriendRequestSerializer(received, fields=('id', 'from_user'), many=True).data}, status=status.HTTP_200_OK)
