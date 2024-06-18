from django.http import HttpRequest
from django.shortcuts import render

def spa_render(request: HttpRequest, path, context=None):
    if request.headers.get('X-Source') == "SPA":
        return render(request, path, context=context)
    return render(request, 'index.html')
