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
from django.urls import path
from users.views import *
from chat.views import *
from game.views import GameStorageView, GamesView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/42/', Log42.as_view()),
    path('api/user/a2f', A2fView.as_view()),
    path('api/user/', UserView.as_view()),
    path('api/user/<str:username>', ProfileView.as_view()),
    path('api/user/<str:username>/games/', GamesView.as_view()),
    path('api/user/search/', ReseachUserView.as_view()),
    path('api/user/friends/', FriendView.as_view()),
    path('api/user/friends/requests/', FriendRequestsView.as_view()),
    path('api/user/friends/requests/<int:request_id>', FriendRequestView.as_view()),
    path('api/user/dm/<str:username>', DMView.as_view()),
    path('api/user/groups/', GroupsView.as_view()),
    path('api/user/groups/<int:group_id>', GroupView.as_view()),
    path('api/user/groups/<int:group_id>/leave', GroupLeaveView.as_view()),
    path('api/user/groups/<int:group_id>/messages', GroupMessagesView.as_view()),
    path('api/register/', RegisterUserView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/game/', GameStorageView.as_view())
]
