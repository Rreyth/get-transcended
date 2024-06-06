import requests
from rest_framework.response import Response
from myapp.models import *
from users.models import User
from users.serializer import UserSerializer
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['GET'])
def auth_42(request):
	# Récupérer le code d'authentification de la requête GET
	code = request.GET.get('code')



	# Faire une requête pour échanger le code d'authentification contre un jeton d'accès
	response = requests.post('https://api.intra.42.fr/oauth/token', data={
		'grant_type': 'authorization_code',
		'client_id': '',
		'client_secret': '',
		'code': code,
		'redirect_uri': 'https://localhost:44433/api/42/'
	})


	# Vérifier si la requête a réussi
	if response.status_code == 200:
		# Récupérer le jeton d'accès depuis la réponse JSON
		access_token = response.json()['access_token']
		
		

		# Utiliser le jeton d'accès pour récupérer les informations de l'utilisateur
		user_response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
		user_data = user_response.json()

		# Gérer les informations de l'utilisateur, par exemple, en le connectant ou en le créant dans votre système Django
		# user = User.objects.get_or_create(username=user_data['login'], ...)
		# request.session['user_id'] = user.id

		if User.objects.filter(username=user_data['login']).exists():
			username = user_data['login'] + "_"
		else:
			username = user_data['login']
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
			# refresh["username"] = username
			return Response({'access' : str(refresh.access_token)}, status=status.HTTP_201_CREATED)

		except Exception as e:
			if str(e).find("users_user_username_key") != -1:
				return Response({'username': 'username already exist'}, status=status.HTTP_400_BAD_REQUEST)
			elif str(e).find("users_user_email_key") != -1:
				return Response({'email': 'email already exist'}, status=status.HTTP_400_BAD_REQUEST)
			else:
				return Response({'error': 'Internal Error'}, status=status.HTTP_400_BAD_REQUEST)
	else:
		return Response({'api': 'Erreur lors de l\'authentification API'}, status=status.HTTP_401_UNAUTHORIZED)

# 'duplicate key value violates unique constraint "users_user_username_key"\nDETAIL:  Key (username)=(njegat) already exists.\n'

# YEEEEEEEEEEEEE duplicate key value violates unique constraint "users_user_email_key"