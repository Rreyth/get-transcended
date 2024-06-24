from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User
from users.serializer import UserSerializer

class ReseachUserView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        username_prefix = request.query_params.get('username_prefix', '')
        users = User.objects.filter(username__icontains=username_prefix)[:10]
        return Response(UserSerializer(users, many=True).data, status=status.HTTP_200_OK)
