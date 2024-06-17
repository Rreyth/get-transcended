from django.urls import path
# from . import views

from users.views import *

urlpatterns = [
	path('', home, name='home'),
	path('sign/', sign, name='sign'),
	path('user/<str:username>', profile, name='user'),
	path('pong/', pong, name='pong'),
]