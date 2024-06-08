from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from users.models import User, FriendRequest
from .serializer import UserSerializer, FriendRequestSerializer, CustomTokenObtainPairSerializer
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import os

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

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
                return Response(token.validated_data, status=status.HTTP_201_CREATED)
            else:
                return Response(token.errors, status=status.HTTP_400_BAD_REQUEST)
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
                    else:
                        refresh["username"] = user_data['login']
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


class A2fView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        return Response({ "actived": request.user.a2f }, status=status.HTTP_200_OK)

class ReseachUserView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        username_prefix = request.query_params.get('username_prefix', '')
        users = User.objects.filter(username__icontains=username_prefix)[:10]
        usernames = [user.username for user in users]
        return Response(usernames, status=status.HTTP_200_OK)

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

class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
