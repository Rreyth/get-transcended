from django.http import HttpRequest
from transcend.views.utils import spa_render

def pong(request: HttpRequest):
    return spa_render(request, 'pong.html')
