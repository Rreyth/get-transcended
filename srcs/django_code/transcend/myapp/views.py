import requests
from django.http import JsonResponse
from rest_framework.response import Response
from myapp.models import *
from users.models import User
from users.serializer import UserSerializer
from rest_framework.decorators import api_view

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
		print(user_data['login'], flush=True)
		print(user_data['email'], flush=True)
		print(user_data['image']['link'], flush=True)

		try:
			response = User.objects.get_or_create(username=user_data['login'], login42=user_data['login'], email=user_data['email'], password="coucou", avatar=user_data['image']['link'])
			serializer = UserSerializer(response[0])
			print(serializer, flush=True)
			return Response(serializer.data)
		except User.DoesNotExist:
			return Response({test: "oui"})

	else:
		return JsonResponse({'error': 'Erreur lors de l\'authentification'}, status=401)
