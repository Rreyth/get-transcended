from django.urls import path

from .profile import *

urlpatterns = [
	path('user/<str:username>', profile, name='user')
]
