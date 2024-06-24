from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User

class BlockUserView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        if not 'user' in request.data:
            return Response({'message': 'user field is required'}, status=status.HTTP_400_BAD_REQUEST)

        if request.data['user'] == request.user.username:
            return Response({'message': 'You can\'t block yourself'}, status=status.HTTP_403_FORBIDDEN)

        user = User.objects.get(username=request.data['user'])

        request.user.blocked_users.add(user)

        return Response({'message': 'Success'}, status=status.HTTP_200_OK)
