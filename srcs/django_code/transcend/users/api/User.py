from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.serializer import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError

class UserView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if not request.user.login42:
            if "current_password" not in request.data:
                return Response({'error': 'err_current_password_required', 'errormsg': 'current_password is required'}, status=status.HTTP_400_BAD_REQUEST)
            if not request.user.check_password(request.data["current_password"]):
                return Response({'error': 'err_current_password_bad', 'errormsg': 'Bad current_password'}, status=status.HTTP_401_UNAUTHORIZED)
        if "username" in request.data:
            if len(request.data["username"]) > 24:
                return Response({'error': 'err_username_toolong', 'errormsg': 'username is too long'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = UserSerializer(request.user, data=request.data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()

            refresh = RefreshToken.for_user(request.user)
            refresh["username"] = request.user.username
            refresh["avatar"] = request.user.avatar.url if request.user.avatar and hasattr(request.user.avatar, 'url') else None
            refresh["email"] = request.user.email
            refresh['login42'] = request.user.login42
            return Response({'access' : str(refresh.access_token)}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            if 'username' in str(e):
                return Response({'error': 'err_exist_user', 'errormsg': 'This username alredy exist'}, status=status.HTTP_400_BAD_REQUEST)
            elif 'email' in str(e):
                return Response({'error': 'err_exist_email', 'errormsg': 'This email alredy exist'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'err_inte_data', 'errormsg': 'Data integrity error'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e), flush=True)
            return Response({'error': 'err_unexpected', 'errormsg': 'An unexpected error are occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
