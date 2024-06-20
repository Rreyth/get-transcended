from django.http import HttpRequest
from transcend.views.utils import spa_render

def login(request: HttpRequest):
    return spa_render(request, 'login.html')
