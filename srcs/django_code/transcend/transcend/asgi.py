"""
ASGI config for transcend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path
from myapp import views

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcend.settings')

# application = get_asgi_application()

websocket_urlpatterns = [
    path('api/chat', views.MyConsumer.as_asgi()),
    path('api/pong', views.PongDB.as_asgi())
]
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
})