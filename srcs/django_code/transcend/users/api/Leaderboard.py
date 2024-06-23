from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User
from users.serializer import UserSerializer

class LeaderboardView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        user = User.objects.all().order_by("-wins").exclude(pk=1)
        return Response(UserSerializer(user, many=True).data, status=status.HTTP_200_OK)
