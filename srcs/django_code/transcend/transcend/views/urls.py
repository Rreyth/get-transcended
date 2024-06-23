from django.urls import path

from .home import *
from .login import *

urlpatterns = [
	path('', home, name='home'),
	path('login', login, name='login')
]
