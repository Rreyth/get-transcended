from django.http import HttpRequest
from transcend.views.utils import spa_render

def page_404(request: HttpRequest, exception):
    return spa_render(request, '404.html')
