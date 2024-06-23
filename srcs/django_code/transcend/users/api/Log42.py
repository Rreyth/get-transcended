from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from chat.models import Group
from users.models import User
from users.serializer import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import os

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

class Log42(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    def get(self, request):
        code = request.GET.get('code')

        try:
            response = requests.post('https://api.intra.42.fr/oauth/token', data={
                'grant_type': 'authorization_code',
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'code': code,
                'redirect_uri': 'https://localhost:44433/'
            })


            if response.status_code == 200:
                access_token = response.json()['access_token']


                user_response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
                user_data = user_response.json()

                username = user_data['login']

                while User.objects.filter(username=username).exists() and len(username) < 25:
                    username += "_"
                try:
                    user, created = User.objects.get_or_create(
                        login42=user_data['login'],
                        defaults={
                            "username" : username,
                            "email" : user_data['email'],
                            "password" : "coucou",
                            "avatar" : user_data['image']['link'],
                            }
                        )

                    serializer = UserSerializer(user)
                    refresh = RefreshToken.for_user(user)
                    if created:
                        refresh["username"] = username
                        group = Group.objects.get(pk=1)

                        group.members.add(user)
                    else:
                        refresh["username"] = user.username
                    refresh['avatar'] = user.avatar.url if user.avatar and hasattr(user.avatar, 'url') else None
                    refresh['email'] = user.email
                    refresh['login42'] = user.login42
                    return Response({'access' : str(refresh.access_token)}, status=status.HTTP_201_CREATED)

                except Exception as e:
                    if str(e).find("users_user_username_key") != -1:
                        return Response({'username': 'username already exist'}, status=status.HTTP_400_BAD_REQUEST)
                    elif str(e).find("users_user_email_key") != -1:
                        return Response({'email': 'email already exist'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({'error': 'Internal Error', "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'apiError': 'Error connexion api'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'apiError': 'Error connexion api', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
