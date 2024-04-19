"""transcend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.decorators.csrf import csrf_exempt
from myapp import views
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

websocket_urlpatterns = [
    path('api/', views.MyConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    # 'https': get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
})

urlpatterns = [
    #path('', views.home, name='home'),
    # path('', views.index, name='index'),
    path('auth/42/', views.auth_42, name='auth_42'),
    # re_path(r'^(?!auth/42/).*$', views.index),
    # path('admin/', admin.site.urls),
    path('api/auth/login', csrf_exempt(views.AuthApi.as_view()), name='login'),
    path('api/auth/logout', csrf_exempt(views.AuthApi.as_view()), name='logout'),
    path('api/auth/register', csrf_exempt(views.register), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
