from django.urls import path

from .pong import *

urlpatterns = [
	path('pong', pong, name='pong')
]
