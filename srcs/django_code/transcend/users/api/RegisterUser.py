from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from chat.models import Group
from users.serializer import UserSerializer, CustomTokenObtainPairSerializer

class RegisterUserView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            if len(serializer.validated_data["username"]) > 24:
                return Response({"message": "username length is too long"}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save()
            token = CustomTokenObtainPairSerializer(data=request.data)

            if token.is_valid():
                group = Group.objects.get(pk=1)

                group.members.add(user)
                return Response(token.validated_data, status=status.HTTP_201_CREATED)
            else:
                return Response(token.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
