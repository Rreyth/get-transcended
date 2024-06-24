"""
ASGI config for transcend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcend.settings')
django.setup()

from chat.consumers import ChatConsumer
from users.middleware import JwtAuthMiddlewareStack
from users.consumers import *

websocket_urlpatterns = [
    path('ws/messages', ChatConsumer.as_asgi()),
    path('ws/user/online', OnlineConsumer.as_asgi()),
    path('ws/user/friends', FriendAcceptConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
            JwtAuthMiddlewareStack(
                URLRouter(websocket_urlpatterns)
            )
        ),
})