from django.http import HttpRequest
from transcend.views.utils import spa_render

def profile(request: HttpRequest, username):
    print(f"User: {username}")
    return spa_render(request, 'profile.html')
