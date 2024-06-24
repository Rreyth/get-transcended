from django.http import HttpRequest
from transcend.views.utils import spa_render

def home(request: HttpRequest):
    return spa_render(request, 'home.html')
