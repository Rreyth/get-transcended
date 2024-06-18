from django.http import HttpRequest
from transcend.views.utils import spa_render

def sign(request: HttpRequest):
    return spa_render(request, 'sign.html')
