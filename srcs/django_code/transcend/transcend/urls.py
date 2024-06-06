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
from myapp import views
from users.views import RegisterUserView, UserView, FriendView, FriendRequestsView, FriendRequestView, ReseachUserView, ProfileView, MyTokenObtainPairView
from users.views import RegisterUserView, UserView, FriendView, FriendRequestsView, FriendRequestView, ReseachUserView, MyTokenObtainPairView
from chat.views import DMView
from game.views import GameStorageView, GamesView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('auth/42/', views.auth_42, name='auth_42'),
    path('api/user/', UserView.as_view()),
    path('api/user/<str:username>', ProfileView.as_view()),
    path('api/user/<str:username>/games/', GamesView.as_view()),
    path('api/user/search/', ReseachUserView.as_view()),
    path('api/user/friends/', FriendView.as_view()),
    path('api/user/friends/requests/', FriendRequestsView.as_view()),
    path('api/user/friends/requests/<int:request_id>', FriendRequestView.as_view()),
    path('api/user/dm/<int:user>', DMView.as_view()),
    path('api/register/', RegisterUserView.as_view()),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/game/', GameStorageView.as_view())
]
