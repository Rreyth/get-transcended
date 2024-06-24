from django.urls import path

from .A2F import *
from .BlockUserView import *
from .Friend import *
from .FriendRequest import *
from .FriendRequests import *
from .Leaderboard import *
from .Log42 import *
from .Profile import *
from .RegisterUser import *
from .ResearchUser import *
from .User import *

urlpatterns = [
	path('api/42/', Log42.as_view()),
    path('api/user/a2f', A2fView.as_view()),
	path('api/user/a2fConnexion', A2fConnexionView.as_view()),
    path('api/user/', UserView.as_view()),
    path('api/user/leaderboard', LeaderboardView.as_view()),
    path('api/user/blocks', BlockUserView.as_view()),
    path('api/user/<str:username>', ProfileView.as_view()),
    path('api/user/search/', ReseachUserView.as_view()),
    path('api/user/friends/', FriendView.as_view()),
    path('api/user/friends/requests/', FriendRequestsView.as_view()),
    path('api/user/friends/requests/<int:request_id>', FriendRequestView.as_view()),
    path('api/register/', RegisterUserView.as_view()),
]
