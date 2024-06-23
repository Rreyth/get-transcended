from django.urls import path

from .Games import *
from .GameStorage import *

urlpatterns = [
	path('api/user/<str:username>/games/', GamesView.as_view()),
	path('api/game/', GameStorageView.as_view())
]
