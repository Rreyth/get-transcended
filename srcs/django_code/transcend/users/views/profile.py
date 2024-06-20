from django.http import HttpRequest
from transcend.views.utils import spa_render

def profile(request: HttpRequest, username):
    print(f"\nUser: {username}\n", flush=True)
    # si token invalide, render login et changer l'url ?
    if (False):
        return spa_render(request, 'login.html')
    return spa_render(request, 'profile.html')
