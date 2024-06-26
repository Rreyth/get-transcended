from django.http import HttpRequest
from transcend.views.utils import spa_render
from users.models import User

def profile(request: HttpRequest, username):
    if (User.objects.filter(username=username).exists() == False):
        return spa_render(request, '404.html')
    return spa_render(request, 'profile.html')
