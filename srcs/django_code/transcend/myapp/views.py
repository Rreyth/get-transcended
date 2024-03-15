from django.shortcuts import render
from django.http import JsonResponse
from .models import User

from .forms import LoginForm

# Create your views here.
def home(request):
	return render(request, 'base/home.html')

def about(request):
	return render(request, 'base/about.html')

def login(request):
	if request.method == 'POST':
		form = LoginForm(request.POST)
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			if user is not None:
				return JsonResponse({'status': 'success', 'message': 'Logged in successfully'})
			else:
				return JsonResponse({'status': 'error', 'message': 'Invalid login credentials'})
		else:
			return JsonResponse({'status': 'error', 'message': 'Invalid login credentials'})
	else:
		form = LoginForm()
	return render(request, 'base/login.html', {'form': form})







def auth_42(request):
    # Récupérer le code d'authentification de la requête GET
    code = request.GET.get('code')

    # Faire une requête pour échanger le code d'authentification contre un jeton d'accès
    response = requests.post('https://api.intra.42.fr/oauth/token', data={
        'grant_type': 'authorization_code',
        'client_id': 'u-s4t2ud-b87436860473c1cf2dcaf70686636bad4bb15a2af3ec8ab615615dba0014102c',
        'client_secret': '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',
        'code': code,
        'redirect_uri': 'https://127.0.0.1:44433/auth/42/'
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

        return JsonResponse(user_data)

    else:
        return JsonResponse({'error': 'Erreur lors de l\'authentification'}, status=401)
